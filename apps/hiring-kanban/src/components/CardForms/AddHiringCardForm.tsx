import {
  purgeQueries,
  TWorkflowState,
  useCreateHiringCardMutation,
} from '@juxt-home/site';
import { ModalForm, Option } from '@juxt-home/ui-common';
import { defaultMutationProps } from '@juxt-home/ui-kanban';
import { notEmpty } from '@juxt-home/utils';
import splitbee from '@splitbee/web';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { workflowId } from '../../constants';
import { AddHiringCardInput, AddHiringCardModalProps } from './types';

export function AddHiringCardModal({
  isOpen,
  handleClose,
  defaultValues,
  cols,
  projectOptions,
  stateOptions,
}: AddHiringCardModalProps & {
  defaultValues: Partial<AddHiringCardInput>;
  cols: TWorkflowState[];
  projectOptions: Option[];
  stateOptions: Option[];
}) {
  const formHooks = useForm<AddHiringCardInput>({
    defaultValues,
  });

  const queryClient = useQueryClient();
  const AddHiringCardMutation = useCreateHiringCardMutation({
    ...defaultMutationProps(queryClient, workflowId),
    onSuccess: (data) => {
      purgeQueries(['workflow']);
      splitbee.track('Add Hiring Card', {
        data: JSON.stringify(data),
      });
    },
  });
  const AddHiringCard = (card: AddHiringCardInput) => {
    if (!cols.length) {
      toast.error('No workflowStates to add card to');
      return;
    }
    handleClose();
    const newId = `card-${Date.now()}`;
    const { project, workflowState, ...cardInput } = card;
    toast.promise(
      AddHiringCardMutation.mutateAsync({
        cardId: newId,
        workflowStateId: workflowState?.value || cols[0].id,
        workflowState: {
          cardIds: [
            ...(cols
              .find((c) => c.id === workflowState?.value)
              ?.cards?.filter(notEmpty)
              .map((c) => c.id) || []),
            newId,
          ],
        },
        card: {
          ...cardInput.card,
          workflowProjectId: project?.value,
        },
      }),
      {
        pending: 'Creating card...',
        success: 'Card created!',
        error: 'Error creating card',
      },
    );

    formHooks.resetField('card');
  };

  return (
    <ModalForm<AddHiringCardInput>
      title="Add Card"
      formHooks={formHooks}
      fields={[
        {
          id: 'CardState',
          label: 'Card State',
          rules: {
            required: true,
          },
          options: stateOptions,
          path: 'workflowState',
          type: 'select',
        },
        {
          id: 'CardProject',
          type: 'select',
          options: projectOptions,
          label: 'Project',
          path: 'project',
        },
        {
          label: 'CV PDF',
          id: 'CVPDF',
          type: 'file',
          accept: 'application/pdf',
          multiple: false,
          path: 'card.cvPdf',
        },
        {
          id: 'CardName',
          placeholder: 'Card Name',
          label: 'Name',
          type: 'text',
          rules: {
            required: true,
          },
          path: 'card.title',
        },
        {
          id: 'CardDescription',
          label: 'Description',
          placeholder: 'Card Description',
          type: 'tiptap',
          path: 'card.description',
        },
        {
          label: 'Source',
          id: 'Agent',
          type: 'text',
          path: 'card.agent',
        },
        {
          label: 'Location',
          id: 'Location',
          type: 'text',
          path: 'card.location',
        },
        {
          label: 'Files',
          accept: 'image/jpeg, image/png, image/gif, application/pdf',
          id: 'CardFiles',
          type: 'multifile',
          path: 'card.files',
        },
      ]}
      onSubmit={formHooks.handleSubmit(AddHiringCard, console.warn)}
      isOpen={isOpen}
      handleClose={handleClose}
    />
  );
}
