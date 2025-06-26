import { DocViewer } from '@/components/doc-viewer';
import { mockDocSections } from '@/lib/mock-data';

export async function generateStaticParams() {
  return mockDocSections.map((section) => ({
    paperId: section.id,
  }));
}

interface DocViewerPageProps {
  params: {
    paperId: string;
  };
}

export default function DocViewerPage({ params }: DocViewerPageProps) {
  return <DocViewer paperId={params.paperId} />;
}