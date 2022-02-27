import { PdfViewer } from '@juxt-home/ui-common';
import { Worker } from '@react-pdf-viewer/core';

export default function Pdf({ pdfString }: { pdfString?: string }) {
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.12.313/build/pdf.worker.js">
      <PdfViewer props={{}} pdfString={pdfString} />
    </Worker>
  );
}
