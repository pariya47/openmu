import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

// Consistent API Response Interface
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

interface UploadUrlData {
  signedUrl: string;
  path: string;
  filename: string;
  expiresAt?: string;
}

interface RequestBody {
  ext: string;
  turnstileToken: string;
}

interface TurnstileVerificationResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

// Error codes for consistent error handling
const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SECURITY_VERIFICATION_FAILED: 'SECURITY_VERIFICATION_FAILED',
  UPLOAD_URL_CREATION_FAILED: 'UPLOAD_URL_CREATION_FAILED',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
  MISSING_REQUIRED_FIELDS: 'MISSING_REQUIRED_FIELDS',
  INVALID_JSON: 'INVALID_JSON',
  CONFIGURATION_ERROR: 'CONFIGURATION_ERROR'
} as const;

// Validate environment variables
function validateEnvironment(): void {
  const required = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'CLOUDFLARE_TURNSTILE_SECRET_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

function generateSecureUUID(): string {
  return randomUUID();
}

function sanitizeFileExtension(ext: string): string {
  return ext.toLowerCase();
}

async function verifyTurnstile(token: string, ip?: string): Promise<boolean> {
  const turnstileSecret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY!;
  
  const formData = new URLSearchParams({
    secret: turnstileSecret,
    response: token,
  });
  
  if (ip) {
    formData.append('remoteip', ip);
  }
  
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    const result: TurnstileVerificationResponse = await response.json();
    return result.success;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}

// Helper function to create consistent API responses with CORS headers
function createResponse<T>(
  statusCode: number,
  success: boolean,
  data?: T,
  errorCode?: string,
  errorMessage?: string,
  errorDetails?: any
): {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
} {
  const corsHeaders = {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  const response: ApiResponse<T> = {
    success,
    timestamp: new Date().toISOString(),
  };

  if (success && data) {
    response.data = data;
  }

  if (!success && errorCode && errorMessage) {
    response.error = {
      code: errorCode,
      message: errorMessage,
      ...(errorDetails && { details: errorDetails })
    };
  }

  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(response, null, 2),
  };
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Validate environment on cold start
  try {
    validateEnvironment();
  } catch (error) {
    console.error('Environment validation failed:', error);
    return createResponse(
      500,
      false,
      undefined,
      ERROR_CODES.CONFIGURATION_ERROR,
      'Server configuration error'
    );
  }

  // Handle CORS preflight with proper headers
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'text/plain',
      },
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return createResponse(
      405,
      false,
      undefined,
      ERROR_CODES.METHOD_NOT_ALLOWED,
      'Only POST method is allowed'
    );
  }

  try {
    // Parse and validate request body
    if (!event.body) {
      return createResponse(
        400,
        false,
        undefined,
        ERROR_CODES.VALIDATION_ERROR,
        'Request body is required'
      );
    }

    let requestData: RequestBody;
    try {
      requestData = JSON.parse(event.body);
    } catch {
      return createResponse(
        400,
        false,
        undefined,
        ERROR_CODES.INVALID_JSON,
        'Invalid JSON in request body'
      );
    }

    const { ext, turnstileToken } = requestData;

    // Validate required fields
    if (!ext || !turnstileToken) {
      return createResponse(
        400,
        false,
        undefined,
        ERROR_CODES.MISSING_REQUIRED_FIELDS,
        'File extension and Turnstile token are required',
        { requiredFields: ['ext', 'turnstileToken'] }
      );
    }

    // Get client IP for Turnstile verification
    const clientIP = event.headers['x-forwarded-for']?.split(',')[0] || 
                     event.headers['x-real-ip'];

    // Verify Turnstile token
    const turnstileVerified = await verifyTurnstile(turnstileToken, clientIP);
    if (!turnstileVerified) {
      return createResponse(
        403,
        false,
        undefined,
        ERROR_CODES.SECURITY_VERIFICATION_FAILED,
        'Security verification failed'
      );
    }

    // Generate secure filename
    const sanitizedExt = sanitizeFileExtension(ext);
    const filename = `${generateSecureUUID()}.${sanitizedExt}`;
    const filePath = `uploads/${filename}`;

    // Create signed upload URL
    const supabase = createAdminClient();
    const { data, error } = await supabase.storage
      .from('uploads')
      .createSignedUploadUrl(filePath, {
        upsert: false,
      });

    if (error) {
      console.error('Supabase error:', error);
      return createResponse(
        500,
        false,
        undefined,
        ERROR_CODES.UPLOAD_URL_CREATION_FAILED,
        'Failed to create upload URL'
      );
    }

    // Calculate expiration time (Supabase signed URLs typically expire in 1 hour)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    const responseData: UploadUrlData = {
      signedUrl: data.signedUrl,
      path: filePath,
      filename: filename,
      expiresAt
    };

    return createResponse(200, true, responseData);

  } catch (error) {
    console.error('Upload URL generation error:', error);
    return createResponse(
      500,
      false,
      undefined,
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      'Internal server error'
    );
  }
};