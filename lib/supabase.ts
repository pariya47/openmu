import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Subtopic {
  content: string;
  mermaid: string;
  subtopic_title: string;
}

export interface Topic {
  topic: string;
  subtopics: Subtopic[];
}

export interface Paper {
  id: number;
  created_at: string;
  topics: Topic[];
}