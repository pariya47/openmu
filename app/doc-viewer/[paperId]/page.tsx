import { DocViewer } from '@/components/doc-viewer';
import { mockDocSections, samplePapers } from '@/lib/mock-data';

export async function generateStaticParams() {
  // Safely handle the case where arrays might be undefined
  const mockSectionParams = (mockDocSections || []).map((section) => ({
    paperId: section.id,
  }));
  
  const samplePaperParams = (samplePapers || []).map((paper) => ({
    paperId: paper.id,
  }));
  
  return [...mockSectionParams, ...samplePaperParams];
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