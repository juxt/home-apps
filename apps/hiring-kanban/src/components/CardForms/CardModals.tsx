import { XIcon } from '@heroicons/react/solid';
import {
  LocationGenerics,
  useProjectOptions,
  useCardById,
  useStatesOptions,
} from '@juxt-home/site';
import { ModalTabs, Modal, PdfViewer } from '@juxt-home/ui-common';
import { useMobileDetect } from '@juxt-home/utils';
import * as _ from 'lodash';
import { useNavigate, useSearch } from 'react-location';
import { workflowId } from '../../constants';
import { AddHiringCardModal } from './AddHiringCardForm';
import { CardHistory } from './CardHistory';
import { CardView } from './CardView';
import {
  AddHiringCardModalProps,
  AddHiringCardInput,
  EditCardModalProps,
} from './types';
import { UpdateHiringCardForm } from './UpdateHiringCardForm';

export function AddHiringCardModalWrapper({
  isOpen,
  handleClose,
}: AddHiringCardModalProps) {
  const { workflowProjectId } = useSearch<LocationGenerics>();
  const [{ data: cols }, stateOptions] = useStatesOptions({ workflowId });
  const projectOptions = useProjectOptions(workflowId);

  const defaultValues: Partial<AddHiringCardInput> = {
    project:
      projectOptions.find((p) => p.value === workflowProjectId) ||
      projectOptions[0],
    workflowStateId: stateOptions?.[0]?.value,
    workflowState: stateOptions?.[0],
  };

  return (
    <>
      {_.isEmpty(stateOptions) || !cols ? (
        <div>Loading workflow states...</div>
      ) : (
        <AddHiringCardModal
          isOpen={isOpen}
          handleClose={handleClose}
          defaultValues={defaultValues}
          projectOptions={projectOptions}
          cols={cols}
          stateOptions={stateOptions}
        />
      )}
    </>
  );
}

export function EditHiringCardModal({
  isOpen,
  handleClose,
}: EditCardModalProps) {
  const { cardModalView, ...search } = useSearch<LocationGenerics>();
  const cardId = useSearch<LocationGenerics>().modalState?.cardId;
  const { data, error } = useCardById(cardId);
  const navigate = useNavigate<LocationGenerics>();
  const hasUnsaved = false; // TODO
  const card = data?.cardsByIds?.[0];
  const pdfLzString = card?.cvPdf?.base64;
  const isMobile = useMobileDetect().isMobile();

  const onClose = () => {
    const confirmation =
      hasUnsaved &&
      // eslint-disable-next-line no-restricted-globals
      confirm('You have unsaved changes. Are you sure you want to close?');
    if (!hasUnsaved || confirmation) {
      handleClose();
      if (cardModalView !== 'view') {
        // delayed to stop flicker
        setTimeout(() => {
          navigate({
            search: {
              ...search,
              modalState: undefined,
              cardModalView: undefined,
            },
          });
        }, 400);
      }
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      handleClose={onClose}
      fullWidth={cardModalView !== 'update'}
      noScroll>
      <div className="fixed w-full top-0 z-10 bg-white">
        <ModalTabs
          tabs={[
            { id: 'view', name: 'View', default: !cardModalView },
            { id: 'cv', name: 'CV', hidden: !isMobile || !pdfLzString },
            { id: 'update', name: 'Edit' },
            { id: 'history', name: 'History' },
          ]}
          navName="cardModalView"
        />
        <div className="absolute top-3 right-3 w-5 h-5 cursor-pointer">
          <XIcon onClick={onClose} />
        </div>
      </div>
      <div className="h-full" style={{ paddingTop: '54px' }}>
        {error && (
          <div className="flex flex-col justify-center items-center h-full">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-gray-900">
                Error Loading Card
              </h1>
            </div>
            <div className="text-center">
              <p className="text-gray-700">{error.message}</p>
            </div>
          </div>
        )}
        {(!cardModalView || cardModalView === 'view') && <CardView />}
        {cardModalView === 'update' && (
          <UpdateHiringCardForm handleClose={onClose} />
        )}
        {cardModalView === 'history' && <CardHistory />}
        {cardModalView === 'cv' && (
          <div className="block mx-auto max-w-xl h-full min-h-full ">
            <PdfViewer pdfString={pdfLzString} />
          </div>
        )}
      </div>
    </Modal>
  );
}
