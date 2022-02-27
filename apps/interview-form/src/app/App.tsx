import './App.css';
import {
  CreateInterviewFeedbackMutationVariables,
  hiringWorkflowId,
  TDetailedCard,
  UpdateHiringCardMutationVariables,
  useAllProjectsQuery,
  useCardById,
  useProjectOptions,
} from '@juxt-home/site';
import { notEmpty, useMobileDetect, useWindowSize } from '@juxt-home/utils';
import { lazy, Suspense } from 'react';
import {
  MetadataGrid,
  StandaloneForm,
  TipTapContent,
  Option,
  CommentSection,
} from '@juxt-home/ui-common';
import { useForm } from 'react-hook-form';

const PdfViewer = lazy(() => import('../components/PdfViewer'));

function IndividualFeedback({ cardId }: { cardId: string }) {
  return (
    <div>
      <h2>Rating</h2>
      <input type="slider" />
    </div>
  );
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

type InterviewCardFormFields = UpdateHiringCardMutationVariables & {
  project: Option;
};

function InterviewForm({ card }: { card: TDetailedCard }) {
  const projectOptions = useProjectOptions(hiringWorkflowId);
  const cardFormHooks = useForm<InterviewCardFormFields>({
    defaultValues: {
      project: { label: card?.project?.name, value: card?.project?.id },
      card: {
        location: card?.location,
      },
    },
  });
  const feedbackFormHooks = useForm<CreateInterviewFeedbackMutationVariables>({
    defaultValues: {
      interviewFeedback: {
        cardId: card.id,
        id: `${card.id}alexstage1feedback`,
        overallScore: 0,
        summary: '<p></p>',
      },
    },
  });

  return (
    <div className="w-full my-4 px-4">
      {card && (
        <>
          <StandaloneForm
            handleSubmit={() =>
              cardFormHooks.handleSubmit(console.log, console.log)()
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
          <StandaloneForm
            handleSubmit={() => {
              feedbackFormHooks.handleSubmit(console.log, console.log)();
            }}
            formHooks={feedbackFormHooks}
            title="Alx's feedback"
            description="Record any information specific to this interview here"
            fields={[
              {
                type: 'number',
                label: 'Overall Score',
                rules: {
                  required: {
                    value: true,
                    message: 'Please enter an overall score',
                  },
                  max: {
                    value: 10,
                    message: 'Please enter a score between 0 and 10',
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
                description:
                  'Overall summary of the interview, what did the candidate do well?',
                type: 'tiptap',
              },
            ]}
          />
        </>
      )}
      <div className="pt-2">
        <CommentSection eId="foo" />
      </div>
    </div>
  );
}

function DesktopView() {
  const { card } = useCardById('card-candidates/NazariiBardiuk.adoc');
  const size = useWindowSize();
  return (
    <div className="flex">
      <div className="overflow-auto h-screen w-full">
        {card && <InterviewForm card={card} />}
      </div>
      <div className="overflow-auto h-screen w-full">
        <Suspense fallback={<div>loading pdf worker...</div>}>
          <PdfViewer
            // needed so the pdf viewer resizes correctly
            key={size.width?.toString() || 'pdfviewer'}
            pdfString={card?.cvPdf?.base64}
          />
        </Suspense>
      </div>
    </div>
  );
}

function MobileView() {
  // not sure anyone will actually use this on mobile so probably not worth thinking too much about
  const { card } = useCardById('card-candidates/NazariiBardiuk.adoc');
  return card ? (
    <div className="h-screen overflow-auto">
      <InterviewForm card={card} />
    </div>
  ) : null;
}

export function App() {
  const { card, isLoading } = useCardById('card-candidates/AdamHeinke.adoc');
  const isMobile = useMobileDetect().isMobile();
  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : card ? (
        isMobile ? (
          <MobileView />
        ) : (
          <DesktopView />
        )
      ) : (
        <div>No card found</div>
      )}
    </div>
  );
}
