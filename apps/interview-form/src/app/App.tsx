import './App.css';
import {
  TDetailedCard,
  UpdateHiringCardMutationVariables,
  useAllProjectsQuery,
  useCardById,
} from '@juxt-home/site';
import { notEmpty, useMobileDetect } from '@juxt-home/utils';
import { lazy, Suspense } from 'react';
import { StandaloneForm } from '@juxt-home/ui-common';
import { useForm } from 'react-hook-form';

const PdfViewer = lazy(() => import('../components/PdfViewer'));

function InterviewForm() {
  const { card } = useCardById('card-candidates/AdamHeinke.adoc');
  const formHooks = useForm<UpdateHiringCardMutationVariables>();
  return (
    <div className="w-full">
      <div>foo</div>
      {card && (
        <StandaloneForm
          formHooks={formHooks}
          title={card.title}
          description={'a description'}
          fields={[
            {
              path: 'card.title',
              label: 'Title',
              description: 'The title of the card',
              type: 'text',
              id: 'title',
            },
          ]}
        />
      )}
    </div>
  );
}

function DesktopView() {
  const { card } = useCardById('card-candidates/AdamHeinke.adoc');
  return (
    <div className="flex">
      <InterviewForm />
      <div className="overflow-auto h-screen w-full">
        <Suspense fallback={<div>loading pdf worker...</div>}>
          <PdfViewer pdfString={card?.cvPdf?.base64} />
        </Suspense>
      </div>
    </div>
  );
}

function MobileView() {
  return <InterviewForm />;
}

export function App() {
  const { card, isLoading } = useCardById('card-candidates/AdamHeinke.adoc');
  const isMobile = useMobileDetect().isMobile();
  return (
    <div className="App">
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
