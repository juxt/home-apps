import { Tiptap, Button, Modal } from '@juxt-home/ui-common';
import { Slider } from '@mantine/core';
import { useState, useRef, useEffect } from 'react';

export function InterviewModal({
  handleClose,
  show,
}: {
  show: boolean;
  handleClose: () => void;
}) {
  const [questionNumber, setQuestionNumber] = useState(1);

  const questions = [
    {
      id: 'q-1',
      question:
        'Tell me about a time where your communication with others helped you build rapport or create better relationships and outcomes?',
      lookingFor: [
        'How did they learn about the other person?',
        'Were their exchanges based on respect, or simply getting an outcome?',
        ' Did they continue the effort? Did they only do so to get a result, or do they show a pattern of always working at relationships?',
      ],
      weak: [
        'Only interested in other person for potential outcome',
        'Does not consistently build relationships',
        'Only calls when they want something',
        'Cannot demonstrate clear business benefit',
      ],
      strong: [
        'Creates strategy for building relationships',
        'Articulates benefit of wide ranging relationships',
        'Gives before getting',
        'Maintains relationships without near term business gain',
      ],
    },
    {
      id: 'q-2',
      question:
        'Tell me about an effective relationship you have created and kept over a long period. How did you achieve that?',
      lookingFor: [
        'What do they describe as "long"?',
        'What actions did they take to keep the relationship active?',
        'Was there reciprocity – a willingness to share as well as benefit?',
        'What different forms of communication do they use?',
        'How do they communicate in ways that are helpful to the other person?',
      ],
      weak: [
        'Long is less than 1-2 years',
        'Relies on other person to make contact',
        'Does not offer to give before getting',
        'Communicates in a limited way',
        'Has only internal relationships',
      ],
      strong: [
        'Has a strategy for maintaining relationship',
        'Gives without prospect of getting',
        'Communicates in multiple ways',
        'Has relationships in different companies/industries',
        'Demonstrates different communication styles',
      ],
    },
  ];
  const [scores, setScores] = useState<Record<string, number | undefined>>(
    Object.fromEntries(questions.map(({ id }) => [id, undefined])),
  );

  const question = questions[questionNumber - 1];
  const sliderMarks = [
    { value: 0, label: '💩' },
    { value: 25, label: '😕' },
    { value: 50, label: '🤷‍♀️' },
    { value: 75, label: '👌' },
    { value: 100, label: '😎' },
  ];
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
          <div className="text-lg max-w-prose mx-auto">
            <h1>
              <span className="block text-base text-center text-indigo-600 font-semibold tracking-wide uppercase">
                Interview 1
              </span>
              <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Question {questionNumber}
              </span>
            </h1>
            <div className="bg-indigo-700 rounded-lg">
              <div className="text-center mt-4 py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
                <p className="text-xl leading-6 text-indigo-50">
                  {question.question}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 prose prose-indigo prose-lg text-gray-500 mx-auto">
            <h2>Behaviours to look for:</h2>
            <ul>
              {question.lookingFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="flex space-x-4">
              <div>
                <h2>Weak</h2>
                <ul>
                  {question.weak.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2>Strong</h2>
                <ul>
                  {question.strong.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full">
                <h2>Score:</h2>
                <Slider
                  key={`slider-${questionNumber}`}
                  value={scores[question.id] || 0}
                  onChange={(value) => {
                    setScores({
                      ...scores,
                      [question.id]: value,
                    });
                  }}
                  labelTransition="skew-down"
                  labelTransitionDuration={150}
                  labelTransitionTimingFunction="ease"
                  label={(val) =>
                    sliderMarks.find((mark) => mark.value === val)?.label
                  }
                  defaultValue={50}
                  step={25}
                  marks={[
                    { value: 0, label: 'Weak' },
                    { value: 100, label: 'Strong' },
                  ]}
                />
                <h2>What was said:</h2>
                <div className="flex justify-center">
                  <Tiptap
                    key={`tiptap-${questionNumber}`}
                    onChange={() => null}
                    withTaskListExtension
                    withLinkExtension
                    withTypographyExtension
                    withPlaceholderExtension
                    withMentionSuggestion
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <nav
        className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
        aria-label="Pagination">
        <div className="hidden sm:block">
          <p className="text-sm text-gray-700">
            Question <span className="font-medium">{questionNumber}</span> of{' '}
            <span className="font-medium">{questions.length}</span>
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
            disabled={questionNumber === 1}
            className="mr-2">
            Previous
          </Button>
          {questionNumber === questions.length ? (
            <Button primary onClick={handleNext}>
              Submit
            </Button>
          ) : (
            <Button
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              onClick={handleNext}>
              Next
            </Button>
          )}
        </div>
      </nav>
    </Modal>
  );
}
