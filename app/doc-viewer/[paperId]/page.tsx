import { DocViewer } from '@/components/doc-viewer';

export async function generateStaticParams() {
  // Return empty array since we're fetching dynamic data from Supabase
  return [];
}

interface DocViewerPageProps {
  params: Promise<{
    paperId: string;
  }>;
}

export default async function DocViewerPage({ params }: DocViewerPageProps) {
  const { paperId } = await params;
  return <DocViewer paperId={paperId} />;
}