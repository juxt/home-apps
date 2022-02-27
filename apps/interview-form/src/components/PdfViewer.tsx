import { PdfViewer } from '@juxt-home/ui-common';
import { Worker } from '@react-pdf-viewer/core';
import { toolbarPlugin, ToolbarSlot } from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';

export default function Pdf({ pdfString }: { pdfString?: string }) {
  const toolbarPluginInstance = toolbarPlugin();
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.12.313/build/pdf.worker.js">
      <div className="flex h-full relative">
        <div className="flex flex-col items-center backdrop-blur-sm rounded top-4 -right-5 absolute p-2 -translate-x-1/2 z-10">
          <toolbarPluginInstance.Toolbar>
            {(props: ToolbarSlot) => {
              const { Download, ZoomIn, ZoomOut } = props;
              return (
                <>
                  <div className="px-1 blur-none">
                    <ZoomOut />
                  </div>
                  <div style={{ padding: '0px 2px' }}>
                    <ZoomIn />
                  </div>
                  <div style={{ padding: '0px 2px' }}>
                    <Download />
                  </div>
                </>
              );
            }}
          </toolbarPluginInstance.Toolbar>
        </div>
        <PdfViewer
          props={{ plugins: [toolbarPluginInstance] }}
          pdfString={pdfString}
        />
      </div>
    </Worker>
  );
}
