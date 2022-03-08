import SplitPane from '@andrewray/react-split-pane';
import { Disclosure } from '@headlessui/react';
import {
  CardDetailsFragment,
  LocationGenerics,
  TDetailedCard,
  useCardById,
  useFeedbackForCardQuery,
} from '@juxt-home/site';
import {
  CloseIcon,
  FilePreview,
  CommentSection,
  PdfViewer,
  TipTapContent,
  MetadataGrid,
  IconForScore,
} from '@juxt-home/ui-common';
import { notEmpty, useMobileDetect } from '@juxt-home/utils';
import classNames from 'classnames';
import { useState } from 'react';
import { useSearch } from 'react-location';
import { toast } from 'react-toastify';
import { useThrottleFn } from 'react-use';
import { InterviewModal } from './InterviewForms';
import { QuickEditCardWrapper, TaskListForState } from './UpdateHiringCardForm';

function CardInfo({
  card,
  resetSplit,
}: {
  card?: CardDetailsFragment;
  resetSplit?: () => void;
}) {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const accordionButtonClass = classNames(
    'flex items-center justify-between w-full px-4 py-2 my-2 rounded-base cursor-base focus:outline-none',
    'bg-orange-50 rounded-lg text-primary-800',
  );
  const { devMode } = useSearch<LocationGenerics>();
  const { data: cardFeedbackData } = useFeedbackForCardQuery(
    {
      cardId: card?.id || '',
    },
    {
      enabled: notEmpty(card?.id),
    },
  );
  const totalFeedbacks = cardFeedbackData?.feedbackForCard?.length || 0;
  const totalScores = cardFeedbackData?.feedbackForCard
    ?.filter(notEmpty)
    ?.map((f) => f.overallScore)
    ?.reduce((acc, curr) => acc + curr || 0, 0);
  const averageScore =
    totalScores && totalFeedbacks && Math.floor(totalScores / totalFeedbacks);
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
            feedbackForCard={cardFeedbackData?.feedbackForCard}
            show={showFeedbackModal}
            handleClose={() => setShowFeedbackModal(false)}
          />
          <div className="h-full overflow-y-auto flex flex-col items-center">
            {resetSplit && (
              <button
                type="button"
                className="lg:hidden absolute top-0 z-20 bg-white left-0 mr-4 mt-4 cursor-pointer"
                onClick={resetSplit}>
                Reset Split
              </button>
            )}
            <MetadataGrid
              title={card.title}
              metadata={[
                {
                  label: 'Card ID',
                  value: card.id,
                  hidden: !devMode,
                },
                {
                  label: 'Project:',
                  value: card.project?.name,
                },
                {
                  label: 'Source:',
                  value: card.agent,
                },
                {
                  label: 'Location:',
                  value: card.location,
                },
                {
                  label: 'Created At:',
                  value: card.createdAt,
                  type: 'date',
                },
                {
                  label: 'Last Updated At:',
                  value: card._siteValidTime,
                  type: 'date',
                },
                {
                  label: 'Last Updated By:',
                  value: card._siteSubject,
                },
                {
                  label: 'Status:',
                  value: card.workflowState?.name,
                },
              ]}>
              {card?.workflowState && card.workflowState.tasks?.[0] && (
                <div className="bg-red-50 prose-sm sm:prose mb-2 p-2">
                  <h2>
                    Action Needed From {card.workflowState.roles?.join(' / ')}
                  </h2>
                  <TaskListForState card={card} />
                </div>
              )}
              {card?.description && (
                <TipTapContent
                  className="p-2 prose-sm sm:prose text-left py-0 bg-slate-50 shadow-lg w-full"
                  growButton
                  htmlString={card.description}
                />
              )}
            </MetadataGrid>
            <div className="max-w-4xl w-full h-full mx-auto text-center flex flex-wrap lg:flex-nowrap items-center lg:items-baseline">
              <div className="w-full lg:h-full lg:overflow-y-auto m-4">
                <Disclosure as="div" className="mt-2 w-full">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={accordionButtonClass}>
                        <span>Quick Edit</span>
                        {CloseIcon(open)}
                      </Disclosure.Button>
                      <Disclosure.Panel className=" pt-4 pb-2 text-sm text-muted">
                        <div className="mt-2 flex justify-between items-center">
                          <QuickEditCardWrapper cardId={card.id} />
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                {true && (
                  <Disclosure defaultOpen as="div" className="mt-2 w-full">
                    {({ open }) => {
                      const interviewFeedbackUrl = `${window.location.origin}/_apps/interview/index.html?interviewCardId=${card.id}&filters=~(tabs~(~-feedback))`;
                      return (
                        <>
                          <Disclosure.Button className={accordionButtonClass}>
                            <span>Interview 1 Feedback</span>
                            {CloseIcon(open)}
                          </Disclosure.Button>
                          <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-muted">
                            <div className="flex flex-col items-center">
                              <button
                                type="button"
                                className="bg-slate-200 rounded-lg text-primary-800 p-4"
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    interviewFeedbackUrl,
                                  );
                                  toast.success('Copied to clipboard');
                                }}>
                                Copy Interview Link (send this to whoever will
                                be performing the interview)
                              </button>
                              {averageScore ? (
                                <button
                                  type="button"
                                  onClick={() => setShowFeedbackModal(true)}
                                  className="bg-stone-200 mt-2 rounded-lg text-primary-800 p-4">
                                  Show Feedback ({totalFeedbacks} collected so
                                  far)
                                </button>
                              ) : null}
                              {averageScore ? (
                                <div className="flex space-x-4 my-4">
                                  <strong>Average Score</strong>
                                  <IconForScore
                                    score={averageScore}
                                    withLabel
                                  />
                                </div>
                              ) : null}
                            </div>
                          </Disclosure.Panel>
                        </>
                      );
                    }}
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
          </div>
        </>
      )}
    </>
  );
}

export function CardView({ card }: { card: TDetailedCard }) {
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

  const pdfData = false;
  return (
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
          <CardInfo
            resetSplit={splitSize > 400 ? resetSplit : undefined}
            card={card}
          />
          <div className="block overflow-y-auto">
            {/* passing splitSize as a key forces the viewer to rerender when split is changed */}
            <PdfViewer key={splitSize} pdfString={pdfData} />
          </div>
        </SplitPane>
      )}
    </div>
  );
}

export function CardViewWrapper() {
  const cardId = useSearch<LocationGenerics>().modalState?.cardId;
  const { data, isLoading } = useCardById(cardId);

  const card = data?.cardsByIds?.[0];

  return (
    <div className="relative h-full">
      {isLoading && (
        <div className="flex flex-col justify-center items-center h-full">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Loading Card Details...
            </h1>
          </div>
        </div>
      )}
      {card && <CardView card={card} />}
    </div>
  );
}
