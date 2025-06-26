import { DocViewer } from "@/components/doc-viewer";

export default function DocViewerPage({ params }: { params: { paperId: string } }) {
  return <DocViewer paperId={params.paperId} />;
}