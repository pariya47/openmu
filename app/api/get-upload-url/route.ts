import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { v4 as uuidv4 } from 'uuid'

interface TurnstileVerificationResponse {
  success: boolean
  'error-codes'?: string[]
  challenge_ts?: string
  hostname?: string
}

export async function POST(request: NextRequest) {
  try {
    const { ext, turnstileToken } = await request.json()

    if (!ext || !turnstileToken) {
      return NextResponse.json(
        { error: 'File extension and Turnstile token are required' },
        { status: 400 }
      )
    }

    // Verify Turnstile token
    const turnstileSecret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY
    if (!turnstileSecret) {
      return NextResponse.json(
        { error: 'Turnstile secret key not configured' },
        { status: 500 }
      )
    }

    const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: turnstileSecret,
        response: turnstileToken,
      }),
    })

    const turnstileResult: TurnstileVerificationResponse = await turnstileResponse.json()

    if (!turnstileResult.success) {
      return NextResponse.json(
        { error: 'Turnstile verification failed', details: turnstileResult['error-codes'] },
        { status: 403 }
      )
    }

    // Validate file extension
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif', 'pdf', 'doc', 'docx', 'txt']
    if (!allowedExtensions.includes(ext.toLowerCase())) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const filename = `${uuidv4()}.${ext}`
    const filePath = `uploads/${filename}`

    // Create signed upload URL using admin client
    const supabase = createAdminClient()
    const { data, error } = await supabase.storage
      .from('uploads')
      .createSignedUploadUrl(filePath, {
        upsert: false,
      })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create upload URL' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      signedUrl: data.signedUrl,
      path: filePath,
      filename: filename
    })

  } catch (error) {
    console.error('Upload URL generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}