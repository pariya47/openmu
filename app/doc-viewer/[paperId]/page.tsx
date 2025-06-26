import { DocViewer, mockDocSections } from "@/components/doc-viewer";

export async function generateStaticParams() {
  return mockDocSections.map((section) => ({
    paperId: section.id,
  }));
}

export default function DocViewerPage({ params }: { params: { paperId: string } }) {
  return <DocViewer paperId={params.paperId} />;
}