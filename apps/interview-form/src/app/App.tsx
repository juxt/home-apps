import './App.css';
import {
  hiringWorkflowId,
  TDetailedCard,
  UpdateHiringCardMutationVariables,
  useCardById,
  useProjectOptions,
} from '@juxt-home/site';
import { useMobileDetect, useWindowSize } from '@juxt-home/utils';
import { lazy, Suspense } from 'react';
import {
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
      card: card,
    },
  });
  const feedbackFormHooks = useForm<InterviewCardFormFields>();

  return (
    <div className="w-full my-4 px-4">
      {card && (
        <>
          <StandaloneForm
            handleSubmit={() => null}
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
            handleSubmit={() => null}
            formHooks={feedbackFormHooks}
            title="Alx's feedback"
            description="Record any information specific to this interview here"
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
  return null;
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
