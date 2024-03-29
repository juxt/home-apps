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
  TipTapContent,
  MetadataGrid,
  IconForScore,
  Modal,
} from '@juxt-home/ui-common';
import { notEmpty } from '@juxt-home/utils';
import Tippy from '@tippyjs/react';
import classNames from 'classnames';
import { useState } from 'react';
import { useSearch } from '@tanstack/react-location';
import { toast } from 'react-toastify';
import { InterviewFeedback } from './InterviewForms';
import {
  QuickEditCardWrapper,
  RejectionPanelWrapper,
  TaskListForState,
} from './UpdateHiringCardForm';
import { ArrowsExpandIcon, ClipboardCopyIcon } from '@heroicons/react/solid';

function CardInfo({ card }: { card?: CardDetailsFragment }) {
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
  const feedbacks = cardFeedbackData?.feedbackForCard?.filter(notEmpty);
  const totalFeedbacks = feedbacks?.length || 0;
  const totalScores = feedbacks
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
          <Modal
            isOpen={showFeedbackModal}
            handleClose={() => setShowFeedbackModal(false)}>
            <InterviewFeedback
              feedbackForCard={cardFeedbackData?.feedbackForCard}
            />
          </Modal>
          <div className="sm:h-full overflow-y-auto sm:overflow-hidden flex flex-col sm:flex-row justify-center">
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
                  label: 'Owners',
                  value: card?.currentOwnerUsernames?.join(', '),
                },
                {
                  label: 'Remote.com?',
                  value: card.hasRemoteFee ? 'Yes' : 'No',
                },
                {
                  label: 'Fast Tracked?',
                  value: card.isFastTrack ? 'Yes' : 'No',
                },
                {
                  label: 'Potential Clients',
                  value: card?.potentialClients?.map((c) => c?.name).join(', '),
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
                    Action needed from {card.workflowState.roles?.join(' / ')}
                  </h2>
                  <TaskListForState card={card} />
                </div>
              )}
              {card?.description && (
                <TipTapContent
                  className="p-2 prose-sm sm:prose text-left py-0 bg-slate-50 shadow-lg w-full md:max-h-max"
                  growButton
                  htmlString={card.description}
                />
              )}
            </MetadataGrid>
            <div className="w-full h-full sm:overflow-y-auto lg:overflow-hidden mx-auto text-center flex flex-wrap lg:flex-nowrap items-center lg:items-baseline">
              <div className="w-full lg:h-full lg:overflow-y-auto m-4 lg:m-0">
                <Disclosure
                  defaultOpen={false}
                  as="div"
                  className="mt-2 w-full">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className={accordionButtonClass}>
                        <span>Rejection Options</span>
                        {CloseIcon(open)}
                      </Disclosure.Button>
                      <Disclosure.Panel className=" pt-4 pb-2 text-sm text-muted">
                        <div className="mt-2 flex justify-between items-center">
                          <RejectionPanelWrapper cardId={card.id} />
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>

                <Disclosure defaultOpen as="div" className="mt-2 w-full">
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
                {card && (
                  <Disclosure defaultOpen as="div" className="mt-2 w-full">
                    {({ open }) => (
                      <>
                        <Disclosure.Button className={accordionButtonClass}>
                          <span>Comments</span>
                          {CloseIcon(open)}
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-muted">
                          <CommentSection eId={card.id} />
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
                <div className="flex flex-col items-center">
                  <div className="flex space-x-2">
                    <Tippy
                      content={
                        <>
                          <p>
                            Send this to the person who will be doing the
                            interview.
                          </p>
                          <p>
                            Their feedback will appear below when they have
                            completed it.
                          </p>
                        </>
                      }>
                      <div>
                        <button
                          type="button"
                          className="flex items-center pr-2 bg-slate-200 rounded-lg text-primary-800 p-2"
                          onClick={() => {
                            const feedbackUrl = `${window.location.origin}/_apps/interview/index.html?interviewCardId=${card.id}&filters=~(tabs~(~-feedback~-pdf))`;
                            navigator.clipboard.writeText(feedbackUrl);
                            toast.success('Copied to clipboard');
                          }}>
                          <ClipboardCopyIcon className="w-4 h-4" />
                          Copy interview link
                        </button>
                      </div>
                    </Tippy>
                    {averageScore ? (
                      <Tippy content="Open feedback in full-screen">
                        <button
                          type="button"
                          onClick={() => setShowFeedbackModal(true)}
                          className="flex items-center pr-2 bg-slate-200 rounded-lg text-primary-800 p-2">
                          <ArrowsExpandIcon className="w-4 h-4" />
                        </button>
                      </Tippy>
                    ) : null}
                  </div>
                  {averageScore ? (
                    <InterviewFeedback
                      feedbackForCard={cardFeedbackData?.feedbackForCard?.sort(
                        (a, b) => {
                          if (a && b) {
                            if (a?._siteCreatedAt > b?._siteCreatedAt) {
                              return -1;
                            }
                            if (a?._siteCreatedAt < b?._siteCreatedAt) {
                              return 1;
                            }
                          }
                          return 0;
                        },
                      )}
                    />
                  ) : null}
                  {averageScore ? (
                    <div className="flex space-x-4 my-4">
                      <strong>Average Score</strong>
                      <IconForScore score={averageScore} withLabel />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export function CardView({ card }: { card: TDetailedCard }) {
  return (
    <div className="flex h-full flex-col lg:flex-row justify-around items-center lg:items-start ">
      <div className="w-full h-full overflow-y-scroll">
        {card && <CardInfo card={card} />}
      </div>
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
