import { DocViewer } from '@/components/doc-viewer';
import { mockDocSections } from '@/lib/mock-data';
import { samplePapers } from '@/components/paper-dashboard';

export async function generateStaticParams() {
  // Combine IDs from both mockDocSections and samplePapers
  const mockSectionParams = mockDocSections.map((section) => ({
    paperId: section.id,
  }));
  
  const samplePaperParams = samplePapers.map((paper) => ({
    paperId: paper.id,
  }));
  
  return [...mockSectionParams, ...samplePaperParams];
}

interface DocViewerPageProps {
  params: {
    paperId: string;
  };
}

export default function DocViewerPage({ params }: DocViewerPageProps) {
  return <DocViewer paperId={params.paperId} />;
}