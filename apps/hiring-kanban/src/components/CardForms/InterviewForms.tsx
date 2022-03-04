import { FeedbackForCardQuery, useFeedbackForCardQuery } from '@juxt-home/site';
import {
  Button,
  Modal,
  TipTapContent,
  IconForScore,
} from '@juxt-home/ui-common';
import { useState, useRef, useEffect } from 'react';

export function InterviewModal({
  handleClose,
  feedbackForCard,
  show,
}: {
  show: boolean;
  feedbackForCard: FeedbackForCardQuery['feedbackForCard'];
  handleClose: () => void;
}) {
  const [questionNumber, setQuestionNumber] = useState(0);

  const feebackItemsCount = feedbackForCard?.length || 0;

  const question = feedbackForCard?.[questionNumber];
  const questions = question?.questions || [];
  const ref = useRef<HTMLDivElement>(null);
  const scrollToTop = () => {
    ref.current?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  const handleNext = () => {
    setQuestionNumber((prev) => prev + 1);
    scrollToTop();
  };

  const handlePrev = () => {
    setQuestionNumber((prev) => prev - 1);
    scrollToTop();
  };
  useEffect(() => {
    setTimeout(() => ref.current?.scrollTo({ top: 0 }), 50);
  }, [show]);

  return (
    <Modal className="h-screen-80" isOpen={show} handleClose={handleClose}>
      <div ref={ref} className="relative py-16 bg-white overflow-auto">
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="text-lg max-w-prose mx-auto flex flex-col">
            {' '}
            <h1>
              <span className="block text-base text-center text-indigo-600 font-semibold tracking-wide uppercase">
                Feedback by {question?._siteSubject}
              </span>
              <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Summary
              </span>
            </h1>
            <strong className="self-center inline-block my-2">
              Overall Suggestion -{' '}
              <IconForScore withLabel score={question?.overallScore} />
            </strong>
            <div className="bg-indigo-50 rounded-lg">
              <div className="py-2 px-4 sm:py-3 sm:px-6 lg:px-8">
                <p className="prose-sm sm:prose lg:prose-xl leading-5 text-black">
                  {question?.summary ? (
                    <TipTapContent
                      fullHeight
                      className="m-0"
                      htmlString={question?.summary}
                    />
                  ) : (
                    'No summary'
                  )}
                </p>
              </div>
            </div>
            {questions.map((q) => (
              <div key={q.question} className="mt-8">
                <h2 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
                  {q.question}
                </h2>
                <div className=" py-2 px-4 sm:py-4 sm:px-6">
                  <p className="prose leading-5">
                    {q.response ? (
                      <TipTapContent
                        fullHeight
                        className="m-0"
                        htmlString={q.response}
                      />
                    ) : (
                      'No response'
                    )}
                  </p>
                </div>

                <strong>{q?.scoreCardsLabel}</strong>
                <div className="mt-4">
                  {q.scoreCards.map((sc) => (
                    <div
                      key={q.question + sc.text}
                      className="flex py-3 items-center border border-b-0 last:border-b first:rounded-t last:rounded-b justify-between">
                      <p className=" font-semibold text-gray-600 px-4">
                        {sc.text}
                      </p>
                      <div className="font-bold pr-3">
                        <IconForScore score={sc.score} withLabel />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <nav
        className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
        aria-label="Pagination">
        <div className="hidden sm:block">
          <p className="text-sm text-gray-700">
            Feedback <span className="font-medium">{questionNumber + 1}</span>{' '}
            of <span className="font-medium">{feebackItemsCount}</span>
          </p>
        </div>
        <div className="flex-1 flex justify-between sm:justify-end">
          <Button
            onClick={() => {
              ref.current?.scrollTo({
                top: 0,
                behavior: 'smooth',
              });
              handlePrev();
            }}
            disabled={questionNumber === 0}
            className="mr-2">
            Previous
          </Button>

          <Button
            disabled={questionNumber === feebackItemsCount - 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            onClick={handleNext}>
            Next
          </Button>
        </div>
      </nav>
    </Modal>
  );
}
