import { createClient } from '@supabase/supabase-js';
import { ReadPageClient } from '@/components/read-page-client';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Paper {
  id: number;
  created_at: string;
  topics: Array<{
    topic: string;
    subtopics: Array<{
      content: string;
      mermaid: string;
      subtopic_title: string;
    }>;
  }>;
}

export async function generateStaticParams() {
  try {
    const { data: papers, error } = await supabase
      .from('papers')
      .select('id');

    if (error) {
      console.error('Error fetching papers for static generation:', error);
      return [];
    }

    return papers?.map((paper) => ({
      paper_id: paper.id.toString(),
    })) || [];
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [];
  }
}

export default async function ReadPage({ 
  params 
}: { 
  params: { paper_id: string } 
}) {
  const paperId = params.paper_id;
  let initialPaper: Paper | null = null;
  let initialError: string | null = null;

  try {
    const { data: paper, error } = await supabase
      .from('papers')
      .select('*')
      .eq('id', paperId)
      .single();

    if (error) {
      initialError = error.message;
    } else {
      initialPaper = paper;
    }
  } catch (error) {
    initialError = error instanceof Error ? error.message : 'An unknown error occurred';
  }

  return (
    <ReadPageClient 
      paperId={paperId}
      initialPaper={initialPaper}
      initialError={initialError}
    />
  );
}