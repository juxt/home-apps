import SplitPane from '@andrewray/react-split-pane';
import { Disclosure } from '@headlessui/react';
import { CardByIdsQuery, LocationGenerics, useCardById } from '@juxt-home/site';
import {
  CloseIcon,
  FilePreview,
  CommentSection,
  PdfViewer,
} from '@juxt-home/ui-common';
import { notEmpty, useMobileDetect } from '@juxt-home/utils';
import classNames from 'classnames';
import DOMPurify from 'dompurify';
import { useState } from 'react';
import { useSearch } from 'react-location';
import { useThrottleFn } from 'react-use';
import { InterviewModal } from './InterviewForms';
import { QuickEditCard, QuickEditCardWrapper } from './UpdateHiringCardForm';

function CardInfo({
  card,
  resetSplit,
}: {
  card?: NonNullable<NonNullable<CardByIdsQuery['cardsByIds']>[0]>;
  resetSplit?: () => void;
}) {
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [splitSize, setSplitSize] = useState(
    parseInt(localStorage.getItem('hsplitPos') || '700', 10),
  );
  const handleResize = (size?: number) => {
    if (size) {
      localStorage.setItem('hsplitPos', size.toString());
    }
  };
  const { devMode } = useSearch<LocationGenerics>();

  useThrottleFn(handleResize, 500, [splitSize]);

  const accordionButtonClass = classNames(
    'flex items-center justify-between w-full px-4 py-2 my-2 rounded-base cursor-base focus:outline-none',
    'bg-orange-50 rounded-lg text-primary-800',
  );
  const metadataLabelClass = classNames(
    'text-sm font-medium text-gray-700 font-bold',
  );
  const metadataClass = classNames('text-sm font-medium text-gray-700');
  return (
    <>
      {!card && (
        <div className="flex flex-col justify-center items-center h-full">
          <h1 className="text-3xl font-extrabold text-gray-900">
            No Card Found
          </h1>
        </div>
      )}
      {card && (
        <>
          <InterviewModal
            show={showQuestionModal}
            handleClose={() => setShowQuestionModal(false)}
          />
          <div className="h-full rounded">
            {resetSplit && (
              <button
                type="button"
                className="lg:hidden absolute top-0 z-20 bg-white left-0 mr-4 mt-4 cursor-pointer"
                onClick={resetSplit}>
                Reset Split
              </button>
            )}
            <SplitPane
              onChange={setSplitSize}
              style={{
                overflowY: 'auto',
              }}
              split="horizontal"
              defaultSize={splitSize}>
              <div className="text-center mx-4 flex flex-col w-full items-center justify-center isolate">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  {card.title}
                </h2>
                <div className="grid grid-cols-2 text-left my-4">
                  {devMode && (
                    <>
                      <p className={metadataLabelClass}>Card ID:</p>
                      <p className={metadataClass}>{card.id}</p>
                    </>
                  )}
                  {card?.project?.name && (
                    <>
                      <p className={metadataLabelClass}>Project:</p>
                      <p className={metadataClass}>{card.project.name}</p>
                    </>
                  )}
                  {card?.agent && (
                    <>
                      <p className={metadataLabelClass}>Agent:</p>
                      <p className={metadataClass}>{card.agent}</p>
                    </>
                  )}
                  {card?.location && (
                    <>
                      <p className={metadataLabelClass}>Location:</p>
                      <p className={metadataClass}>{card.location}</p>
                    </>
                  )}
                  {card?.createdAt && (
                    <>
                      <p className={metadataLabelClass}>Created At:</p>
                      <p className={metadataClass}>
                        {new Date(card.createdAt).toLocaleString()}
                      </p>
                    </>
                  )}
                  <p className={metadataLabelClass}>Last Updated on:</p>
                  <p className={metadataClass}>
                    {new Date(card._siteValidTime).toLocaleString()}
                  </p>
                  {card?._siteSubject && (
                    <>
                      <p className={metadataLabelClass}>Updated By:</p>
                      <p className={metadataClass}>{card._siteSubject}</p>
                    </>
                  )}
                  {card?.workflowState && (
                    <>
                      <p className={metadataLabelClass}>Status:</p>
                      <p className={metadataClass}>{card.workflowState.name}</p>
                    </>
                  )}
                </div>

                {card?.description && (
                  <div
                    className="ProseMirror p-2 prose text-left bg-white shadow-lg w-full no-scrollbar h-full mb-4"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(card?.description || ''),
                    }}
                  />
                )}
              </div>
              <div className="max-w-4xl overflow-y-auto lg:overflow-y-hidden h-full mx-auto text-center flex flex-wrap lg:flex-nowrap items-center lg:items-baseline">
                <div className="w-full lg:h-full lg:overflow-y-auto m-4">
                  <Disclosure as="div" className="mt-2 w-full">
                    {({ open }) => (
                      <>
                        <Disclosure.Button className={accordionButtonClass}>
                          <span>Quick Edit</span>
                          {CloseIcon(open)}
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-muted">
                          <div className="mt-2 flex justify-between items-center">
                            <QuickEditCardWrapper cardId={card.id} />
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                  {false && (
                    <Disclosure defaultOpen as="div" className="mt-2 w-full">
                      {({ open }) => (
                        <>
                          <Disclosure.Button className={accordionButtonClass}>
                            <span>TODO</span>
                            {CloseIcon(open)}
                          </Disclosure.Button>
                          <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-muted">
                            <div className="mt-2 flex justify-between items-center">
                              TODO
                              {/* Status: Booked for 03/02/22 at 4pm
                              <Button
                                onClick={() => setShowQuestionModal(true)}>
                                Start
                              </Button> */}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  )}
                  {card?.files && card?.files.length > 0 && (
                    <Disclosure as="div" className="mt-2 w-full">
                      {({ open }) => (
                        <>
                          <Disclosure.Button className={accordionButtonClass}>
                            <span>Other Files</span>
                            {CloseIcon(open)}
                          </Disclosure.Button>
                          <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-muted">
                            {card?.files && (
                              <div className="mt-2 flex justify-between">
                                {card.files.filter(notEmpty).map((file) => (
                                  <div
                                    key={file.name}
                                    className="flex items-center">
                                    <FilePreview file={file} />
                                  </div>
                                ))}
                              </div>
                            )}
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  )}
                </div>
                <div className="w-full px-4 sm:h-full lg:overflow-y-auto">
                  <CommentSection eId={card.id} />
                </div>
              </div>
            </SplitPane>
          </div>
        </>
      )}
    </>
  );
}

export function CardView() {
  const cardId = useSearch<LocationGenerics>().modalState?.cardId;
  const { data, isLoading } = useCardById(cardId);

  const card = data?.cardsByIds?.[0];
  const screen = useMobileDetect();
  const isMobile = screen.isMobile();

  const [splitSize, setSplitSize] = useState(
    parseInt(localStorage.getItem('vsplitPos') || '900', 10),
  );
  const [splitKey, setSplitKey] = useState(splitSize);
  const handleResize = (size?: number) => {
    if (size) {
      localStorage.setItem('vsplitPos', size.toString());
    }
  };
  useThrottleFn(handleResize, 500, [splitSize]);
  const resetSplit = () => {
    setSplitSize(400);
    setSplitKey(splitSize);
    localStorage.removeItem('vsplitPos');
  };

  const pdfData = card?.cvPdf?.base64;

  return (
    <div className="relative h-full">
      <div className="flex h-full flex-col lg:flex-row justify-around items-center lg:items-start ">
        {isMobile || !pdfData ? (
          <div className="w-full h-full overflow-y-scroll">
            {card && <CardInfo card={card} />}
          </div>
        ) : (
          <SplitPane
            pane2Style={{
              overflowY: 'auto',
            }}
            paneStyle={{
              height: '100%',
            }}
            key={splitKey}
            split="vertical"
            defaultSize={splitSize}
            onChange={setSplitSize}>
            {isLoading && (
              <div className="flex flex-col justify-center items-center h-full">
                <div className="text-center">
                  <h1 className="text-3xl font-extrabold text-gray-900">
                    Loading Card Details...
                  </h1>
                </div>
              </div>
            )}
            <CardInfo
              resetSplit={splitSize > 400 ? resetSplit : undefined}
              card={card}
            />
            <div className="max-w-3xl block overflow-y-auto">
              {/* passing splitSize as a key forces the viewer to rerender when split is changed */}
              <PdfViewer key={splitSize} pdfString={pdfData} />
            </div>
          </SplitPane>
        )}
      </div>
    </div>
  );
}
