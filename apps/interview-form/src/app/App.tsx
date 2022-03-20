import './App.css';
import * as yup from 'yup';
import isEqual from 'lodash-es/isEqual';
import {
  CreateInterviewFeedbackMutationVariables,
  Exact,
  FeedbackForCardQuery,
  hiringWorkflowId,
  InterviewFeedback,
  InterviewFeedbackInput,
  InterviewFeedbackInputSchema,
  LocationGenerics,
  purgeQueries,
  TDetailedCard,
  UpdateHiringCardMutationVariables,
  useCardById,
  useCardByIdsQuery,
  useCreateInterviewFeedbackMutation,
  useFeedbackForCardQuery,
  useProjectOptions,
  useUpdateHiringCardMutation,
  useUser,
} from '@juxt-home/site';
import { notEmpty, useMobileDetect, useWindowSize } from '@juxt-home/utils';
import { lazy, Suspense, useEffect } from 'react';
import {
  StandaloneForm,
  TipTapContent,
  Option,
  Button,
  ThumbDown,
  ThumbUp,
  DoubleThumbUp,
  ThumbUpDown,
  Tiptap,
  DeleteActiveIcon,
  inputClass,
  ToggleTabs,
  useHasFilter,
  ModalTabs,
  CommentSection,
} from '@juxt-home/ui-common';
import {
  Controller,
  FieldArrayWithId,
  useFieldArray,
  useForm,
  UseFormReturn,
} from 'react-hook-form';
import classNames from 'classnames';
import splitbee from '@splitbee/web';
import { useSearch } from 'react-location';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import {
  defaultPPFeedbackData,
  defaultStage1FeedbackData,
  defaultTakeHomeFeedbackData,
} from '../data';
import { yupResolver } from '@hookform/resolvers/yup';

const handleGenericError = (data: object) => toast.error(Object.keys(data));

const PdfViewer = lazy(() => import('../components/PdfViewer'));

const tabs = [
  {
    id: 'details',
    name: 'Show Candidate Details',
    selectedName: 'Hide Candidate Details',
  },
  {
    id: 'pdf',
    name: 'Show PDF',
    selectedName: 'Hide PDF',
  },
  {
    id: 'comments',
    name: 'Show Comments',
    selectedName: 'Hide Comments',
  },
  {
    id: 'feedback',
    name: 'Show Feedback',
    selectedName: 'Hide Feedback',
  },
];

function useInterviewCard() {
  const { interviewCardId } = useSearch<LocationGenerics>();
  const data = useCardById(
    interviewCardId || 'card-candidates/NazariiBardiuk.adoc',
  );
  return data;
}

function CardDescription({ card }: { card: TDetailedCard }) {
  return (
    <div className="prose-sm sm:prose pb-4">
      <h1>{card.title}</h1>
      {card.description && (
        <TipTapContent htmlString={card.description} growButton />
      )}
    </div>
  );
}

function InterviewScoreComponent({
  onChange,
  value,
}: {
  onChange: (value: number) => void;
  value: number;
}) {
  const scores = [
    {
      label: 'No',
      icon: ThumbDown,
      fill: 'red',
    },
    {
      label: 'Not Sure',
      fill: 'orange',
      icon: ThumbUpDown,
    },
    {
      label: 'Yes',
      fill: 'green',
      icon: ThumbUp,
    },
    {
      label: 'Strong Yes',
      fill: 'green',
      icon: DoubleThumbUp,
    },
  ];
  return (
    <div className="flex flex-wrap mt-2">
      {scores.map((score, idx) => {
        const scoreValue = idx + 1;
        const selected = value === scoreValue;
        return (
          <Button
            key={score.label}
            className={classNames(
              ' h-9 whitespace-nowrap mb-2 mr-3 last:mr-0',
              selected
                ? 'shadow-inner text-black hover:bg-blue-50 bg-blue-100'
                : 'text-gray-600 shadow-sm',
            )}
            onClick={() => onChange(scoreValue)}>
            {score?.icon && (
              <score.icon
                fill={selected ? score.fill : 'gray'}
                className="w-6 h-6 mr-2"
              />
            )}
            {score.label}
          </Button>
        );
      })}
    </div>
  );
}

function ScoreCardArray({
  formHooks,
  scoreCardIndex,
  questionIndex,
  onRemove,
  scoreCard,
}: {
  questionIndex: number;
  scoreCardIndex: number;
  onRemove: () => void;
  formHooks: UseFormReturn<CreateInterviewFeedbackMutationVariables, object>;
  scoreCard: FieldArrayWithId<
    Exact<{
      interviewFeedback: InterviewFeedbackInput;
    }>,
    `interviewFeedback.questions.${number}.scoreCards`,
    'id'
  >;
}) {
  const { register, control } = formHooks;

  return (
    <div className="py-2">
      <div className="flex">
        {scoreCard.preSet ? (
          <p>{scoreCard.text}</p>
        ) : (
          <input
            className={classNames(inputClass, 'my-4')}
            placeholder="Score Card Text"
            {...register(
              `interviewFeedback.questions.${questionIndex}.scoreCards.${scoreCardIndex}.text`,
            )}
          />
        )}
        <button
          onClick={onRemove}
          type="button"
          title="Remove Question"
          className="cursor-pointer">
          <DeleteActiveIcon
            fill="pink"
            stroke="red"
            className="ml-2 w-5 h-5 opacity-80 hover:opacity-100"
          />
        </button>
      </div>

      <p className="text-gray-500 italic">{scoreCard.description}</p>
      <Controller
        render={({ field }) => (
          <InterviewScoreComponent
            onChange={field.onChange}
            value={field.value}
          />
        )}
        name={`interviewFeedback.questions.${questionIndex}.scoreCards.${scoreCardIndex}.score`}
        control={control}
      />
    </div>
  );
}

function QuestionForm({
  formHooks,
  question,
  questionIndex,
  onRemove,
}: {
  formHooks: UseFormReturn<CreateInterviewFeedbackMutationVariables, object>;
  question: FieldArrayWithId<
    Exact<{
      interviewFeedback: InterviewFeedbackInput;
    }>,
    'interviewFeedback.questions',
    'id'
  >;
  questionIndex: number;
  onRemove: () => void;
}) {
  const { control, register } = formHooks;
  const {
    fields: scoreCards,
    remove,
    append,
  } = useFieldArray({
    control,
    name: `interviewFeedback.questions.${questionIndex}.scoreCards`,
  });
  return (
    <div>
      <div className="flex items-center">
        <p>Item {questionIndex + 1}</p>
        <button
          onClick={onRemove}
          type="button"
          title="Remove Question"
          className="cursor-pointer">
          <DeleteActiveIcon
            fill="pink"
            stroke="red"
            className="ml-2 w-5 h-5 opacity-80 hover:opacity-100"
          />
        </button>
      </div>
      {question.preSet ? (
        <p className="text-gray-500 italic">{question.question}</p>
      ) : (
        <input
          className={classNames(inputClass, 'my-4')}
          placeholder="Question Text"
          {...register(`interviewFeedback.questions.${questionIndex}.question`)}
        />
      )}
      <Controller
        name={`interviewFeedback.questions.${questionIndex}.response`}
        control={control}
        render={(controlProps) => {
          const { value, onChange } = controlProps.field;
          return (
            <Tiptap
              onChange={onChange}
              content={value as string}
              placeholder="Enter your summary, trying to keep it unopiniated and unbiased"
              withTypographyExtension
              withPlaceholderExtension
            />
          );
        }}
      />
      <div className="pl-4 py-2">
        {scoreCards.length > 0 ? (
          <strong className="text-bold text-lg">
            {question.scoreCardsLabel}
          </strong>
        ) : null}
        {scoreCards.map((scoreCard, scoreCardIdx) => (
          <ScoreCardArray
            key={scoreCard.id}
            scoreCard={scoreCard}
            questionIndex={questionIndex}
            scoreCardIndex={scoreCardIdx}
            formHooks={formHooks}
            onRemove={() => remove(scoreCardIdx)}
          />
        ))}
        {!question.preSet && (
          <Button onClick={() => append({})}>Add ScoreCard</Button>
        )}
      </div>
    </div>
  );
}

function QuestionArray({
  formHooks,
}: {
  formHooks: UseFormReturn<CreateInterviewFeedbackMutationVariables, object>;
}) {
  const { control } = formHooks;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'interviewFeedback.questions',
  });
  return (
    <div className="py-2">
      {fields.map((field, i) => (
        <QuestionForm
          key={field.id}
          formHooks={formHooks}
          question={field}
          questionIndex={i}
          onRemove={() => remove(i)}
        />
      ))}
      <Button
        primary
        noMargin
        className="m-0 p-0"
        onClick={() => append({ question: '' })}>
        Add Question
      </Button>
    </div>
  );
}

type InterviewCardFormFields = UpdateHiringCardMutationVariables & {
  project: Option;
};

const IVStages = [
  {
    id: 'WorkflowStateAwaitStage1IV',
    data: defaultStage1FeedbackData,
  },
  {
    id: 'TakeHome',
    data: defaultTakeHomeFeedbackData,
  },
  {
    id: 'WorkflowStatePP',
    data: defaultPPFeedbackData,
  },
] as const;

function defaultFeedbackData(card: TDetailedCard, username: string) {
  const data = IVStages.find(({ id }) => card.stateStr?.includes(id))?.data;

  return data
    ? data(card.id, username)
    : defaultStage1FeedbackData(card.id, username);
}

function InterviewForm({
  card,
  feedbackData,
}: {
  card: TDetailedCard;
  feedbackData: FeedbackForCardQuery;
}) {
  const projectOptions = useProjectOptions(hiringWorkflowId);
  const cardFormHooks = useForm<InterviewCardFormFields>({
    defaultValues: {
      project: { label: card?.project?.name, value: card?.project?.id },
      cardId: card.id,
      card: {
        location: card?.location,
      },
    },
  });

  const { id: username } = useUser();

  const myFeedback = feedbackData.feedbackForCard
    ?.filter((f) => f && f.stateStr === card.stateStr)
    ?.find((feedback) => feedback?._siteSubject === username);

  const initialFeedback = {
    ...myFeedback,
    cardId: card.id,
    questions: myFeedback
      ? myFeedback?.questions?.filter(notEmpty) ?? []
      : undefined,
  };

  const schema = yup.object({
    interviewFeedback: InterviewFeedbackInputSchema(),
  });
  const feedbackFormHooks = useForm<CreateInterviewFeedbackMutationVariables>({
    resolver: yupResolver(schema),
    defaultValues: {
      interviewFeedback: initialFeedback.questions
        ? initialFeedback
        : defaultFeedbackData(card, username || 'nouser'),
    },
  });

  const hasFilter = useHasFilter();
  const showComments = hasFilter('comments');
  const showFeedback = hasFilter('feedback');
  const showDetails = hasFilter('details');

  const queryClient = useQueryClient();
  const UpdateHiringCardMutation = useUpdateHiringCardMutation({
    onSuccess: (data) => {
      toast.success(
        'Submission received! Thank you for your service, 100 juxtcoins have been deposited in your account',
      );
      const id = data.updateHiringCard?.id;
      if (id) {
        purgeQueries(['workflow']);
        queryClient.refetchQueries(useCardByIdsQuery.getKey({ ids: [id] }));
      }
    },
    onError: (error) => {
      toast.error(`Error updating card ${error.message}`);
    },
  });
  const UpdateHiringCard = (input: InterviewCardFormFields) => {
    const { project, ...cardInput } = input;
    const cardData: UpdateHiringCardMutationVariables = {
      card: {
        ...cardInput.card,
        workflowProjectId: project?.value,
      },
      cardId: input.cardId,
    };

    if (card && !isEqual(cardData.card, card)) {
      UpdateHiringCardMutation.mutate({
        card: cardData.card,
        cardId: input.cardId,
      });
    }
  };

  const AddFeedbackMutation = useCreateInterviewFeedbackMutation({
    onSuccess: (data) => {
      toast.success('Card updated!');
      const id = data.createInterviewFeedback?.id;
      if (id) {
        purgeQueries(['feedbackForCard']);
        queryClient.refetchQueries(useCardByIdsQuery.getKey({ ids: [id] }));
      }
    },
    onError: (error) => {
      toast.error(`Error updating card ${error.message}`);
    },
  });

  const AddFeedback = (input: CreateInterviewFeedbackMutationVariables) => {
    AddFeedbackMutation.mutate({
      interviewFeedback: {
        ...input.interviewFeedback,
        stateStr: card.stateStr || 'WorkflowStateAwaitStage1IV',
      },
    });
    feedbackFormHooks.reset(input);
  };
  return (
    <div className="w-full my-4 px-4">
      {card && (
        <>
          {showDetails && (
            <StandaloneForm
              handleSubmit={() =>
                cardFormHooks.handleSubmit(
                  UpdateHiringCard,
                  handleGenericError,
                )()
              }
              formHooks={cardFormHooks}
              title="Candidate details"
              description="Edit this only if it is incorrect"
              preForm={<CardDescription card={card} />}
              fields={[
                {
                  id: 'CardProject',
                  type: 'select',
                  rules: {
                    required: {
                      value: true,
                      message: 'Please select a project',
                    },
                  },
                  options: projectOptions,
                  label: 'Project',
                  path: 'project',
                },
                {
                  path: 'card.location',
                  label: 'Location',
                  description:
                    'Where the candidate will primarily be working from',
                  type: 'text',
                },
              ]}
            />
          )}
          {showFeedback && (
            <StandaloneForm
              handleSubmit={() => {
                feedbackFormHooks.handleSubmit(
                  AddFeedback,
                  handleGenericError,
                )();
              }}
              formHooks={feedbackFormHooks}
              title={`${username}'s feedback`}
              description="Record any information specific to this interview here"
              fields={[
                {
                  type: 'custom',
                  component: <QuestionArray formHooks={feedbackFormHooks} />,
                  label: 'Feedback record',
                  path: 'interviewFeedback.questions',
                },
                {
                  type: 'custom',
                  label: 'Overall Score',
                  component: (
                    <Controller
                      render={({ field }) => (
                        <InterviewScoreComponent
                          onChange={field.onChange}
                          value={field.value}
                        />
                      )}
                      name="interviewFeedback.overallScore"
                      control={feedbackFormHooks.control}
                    />
                  ),
                  rules: {
                    required: {
                      value: true,
                      message: 'Please enter an overall score',
                    },
                    max: {
                      value: 5,
                      message: 'Please enter a score between 0 and 5',
                    },
                    min: {
                      value: 0,
                      message: 'Please enter a score between 0 and 10',
                    },
                  },
                  path: 'interviewFeedback.overallScore',
                },
                {
                  path: 'interviewFeedback.summary',
                  label: 'Summary',
                  rules: {
                    required: {
                      value: true,
                      message: 'Please enter a summary',
                    },
                  },
                  description:
                    'Overall summary of the interview, what did the candidate do well?',
                  type: 'tiptap',
                },
              ]}
            />
          )}
        </>
      )}
      {showComments && (
        <Suspense fallback={<div>loading comment section...</div>}>
          <div className="pt-2">
            {card?.id && <CommentSection eId={card.id} />}
          </div>
        </Suspense>
      )}
    </div>
  );
}

function PDF({ width, base64 }: { width: string; base64?: string }) {
  return (
    <div>
      {base64 ? (
        <Suspense fallback={<div>loading pdf worker...</div>}>
          <PdfViewer
            // needed so the pdf viewer resizes correctly
            key={width}
            pdfString={base64}
          />
        </Suspense>
      ) : (
        <div>
          <h1>No PDF</h1>
        </div>
      )}
    </div>
  );
}

function InterviewFormWrapper({ card }: { card: TDetailedCard }) {
  const { isLoading, data } = useFeedbackForCardQuery({ cardId: card.id });
  return (
    <div>
      {isLoading ? (
        <div>loading...</div>
      ) : data ? (
        <InterviewForm feedbackData={data} card={card} />
      ) : (
        <div>no data</div>
      )}
    </div>
  );
}

function DesktopView() {
  const { card } = useInterviewCard();
  const size = useWindowSize();
  const base64 = card?.cvPdf?.base64;
  const hasFilter = useHasFilter();
  const showPdf = hasFilter('pdf');
  return (
    <div className="flex">
      <div className="sm:overflow-auto no-scrollbar h-screen-90 pb-10 w-full">
        {card && <InterviewFormWrapper card={card} />}
      </div>

      {showPdf ? (
        <div className="sm:overflow-auto h-screen-90 w-full">
          <PDF width={size.width?.toString() || 'pdf'} base64={base64} />
        </div>
      ) : null}
    </div>
  );
}

function MobileView() {
  // not sure anyone will actually use this on mobile so probably not worth thinking too much about
  const { card } = useInterviewCard();
  const base64 = card?.cvPdf?.base64;
  const hasFilter = useHasFilter();
  const showPdf = hasFilter('pdf');

  if (!card) {
    return <div>loading...</div>;
  }

  return showPdf ? (
    <PDF width="pdf" base64={base64} />
  ) : (
    <InterviewFormWrapper card={card} />
  );
}

export function App() {
  const { card, isLoading } = useInterviewCard();
  const isMobile = useMobileDetect().isMobile();
  const { id: username } = useUser();
  useEffect(() => {
    if (username) {
      splitbee.user.set({ userId: username });
    }
  }, [username]);
  const CardView = isMobile ? MobileView : DesktopView;
  return (
    <>
      <div className="sticky top-0 z-10 bg-white">
        {isMobile ? (
          <ModalTabs navName="view" tabs={tabs} />
        ) : (
          <ToggleTabs tabs={tabs} />
        )}
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : card ? (
        <CardView />
      ) : (
        <div>No card found</div>
      )}
    </>
  );
}
