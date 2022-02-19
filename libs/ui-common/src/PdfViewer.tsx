import { base64toBlob } from '@juxt-home/utils';
import { Viewer } from '@react-pdf-viewer/core';
import { useMemo, useEffect } from 'react';
import '@react-pdf-viewer/core/lib/styles/index.css';

export function PdfViewer({ pdfString }: { pdfString?: string }) {
  const pdfUrl = useMemo(() => {
    const pdfBlob = pdfString && base64toBlob(pdfString);
    if (pdfBlob) {
      return URL.createObjectURL(pdfBlob);
    }
    return null;
  }, [pdfString]);
  // clean up object url on unmount
  useEffect(
    () => () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    },
    [pdfUrl],
  );
  return pdfUrl ? <Viewer fileUrl={pdfUrl} /> : <p>No Pdf</p>;
}
