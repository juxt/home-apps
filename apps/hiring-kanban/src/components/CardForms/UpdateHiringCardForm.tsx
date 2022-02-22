import {
  LocationGenerics,
  useUpdateHiringCardMutation,
  useCardByIdsQuery,
  useMoveCardMutation,
  useWorkflowStates,
  useCardById,
  useProjectOptions,
  TWorkflowState,
  TCard,
  UpdateHiringCardMutationVariables,
} from '@juxt-home/site';
import {
  ArchiveInactiveIcon,
  ArchiveActiveIcon,
  Option,
  Form,
  Button,
  useDirty,
  juxters,
} from '@juxt-home/ui-common';
import { defaultMutationProps } from '@juxt-home/ui-kanban';
import { notEmpty, useMobileDetect } from '@juxt-home/utils';
import _ from 'lodash';
import { useEffect } from 'react';
import { useForm, UseFormReturn, useFormState } from 'react-hook-form';
import { useSearch } from 'react-location';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { workflowId } from '../../constants';
import { UpdateHiringCardInput } from './types';

export function UpdateHiringCardForm({
  handleClose,
}: {
  handleClose: () => void;
}) {
  const { modalState } = useSearch<LocationGenerics>();
  const cardId = modalState?.cardId;
  const queryClient = useQueryClient();
  const UpdateHiringCardMutation = useUpdateHiringCardMutation({
    onSuccess: (data) => {
      const id = data.updateHiringCard?.id;
      if (id) {
        queryClient.refetchQueries(useCardByIdsQuery.getKey({ ids: [id] }));
      }
    },
  });
  const moveCardMutation = useMoveCardMutation({
    ...defaultMutationProps(queryClient, workflowId),
  });

  const cols = useWorkflowStates({ workflowId }).data || [];
  const stateOptions = cols.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const { card } = useCardById(cardId);

  const UpdateHiringCard = (input: UpdateHiringCardInput) => {
    handleClose();
    const { workflowState, project, ...cardInput } = input;
    const cardData = {
      card: {
        ...cardInput.card,
        workflowProjectId: project?.value,
        stateStr: workflowState?.value,
      },
      cardId: input.cardId,
    };

    const state = cols.find((c) => c.id === workflowState?.value);
    if (card && !_.isEqual(cardData.card, card)) {
      UpdateHiringCardMutation.mutate({
        card: cardData.card,
        cardId: input.cardId,
      });
    }
    if (state && state.id !== card?.workflowState?.id) {
      moveCardMutation.mutate({
        workflowStateId: state.id,
        cardId: input.cardId,
        previousCard: 'end',
      });
    }
  };

  const formHooks = useForm<UpdateHiringCardInput>({
    defaultValues: {
      card,
      cardId: card?.id,
    },
  });

  const options = [
    {
      label: 'Archive',
      id: 'archive',
      Icon: ArchiveInactiveIcon,
      ActiveIcon: ArchiveActiveIcon,
      props: {
        onClick: () => {
          handleClose();
          if (card?.id) {
            toast.promise(
              UpdateHiringCardMutation.mutateAsync({
                cardId: card.id,
                card: {
                  ...card,
                  workflowProjectId: null,
                },
              }),
              {
                pending: 'Archiving card...',
                success: 'Card archived!',
                error: 'Error archiving card',
              },
            );
          }
        },
      },
    },
  ];

  useEffect(() => {
    const processCard = async () => {
      if (!card) return;
      const processFiles = card.files?.filter(notEmpty).map(async (f) => {
        const previewUrl = f.name.startsWith('image') && f.base64;
        return {
          ...f,
          preview: previewUrl,
        };
      });
      const doneFiles = processFiles && (await Promise.all(processFiles));
      formHooks.setValue('card.files', doneFiles);
    };
    if (card) {
      formHooks.setValue('workflowState', {
        label: card?.workflowState?.name || 'Select a state',
        value: card?.workflowState?.id || '',
      });
      const workflowProjectId = card?.project?.id;
      formHooks.setValue('card', { ...card });
      if (card?.files) processCard();
      formHooks.setValue('card.cvPdf', card?.cvPdf);
      if (card.project?.name && workflowProjectId) {
        formHooks.setValue('project', {
          label: card.project?.name,
          value: workflowProjectId,
        });
      }
    }
  }, [card, formHooks]);

  const title = card?.title
    ? `${card.title}: ${card.workflowState?.name}`
    : 'Update Card';
  const projectOptions = useProjectOptions(workflowId);
  return (
    <div className="relative h-full">
      <Form
        title={title}
        formHooks={formHooks}
        options={options}
        fields={[
          {
            id: 'CardName',
            placeholder: 'Card Name',
            type: 'text',
            rules: {
              required: true,
            },
            path: 'card.title',
            label: 'Name',
          },
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
            label: 'CV PDF',
            id: 'CVPDF',
            type: 'file',
            accept: 'application/pdf',
            multiple: false,
            path: 'card.cvPdf',
          },
          {
            label: 'Description',
            id: 'CardDescription',
            placeholder: 'Card Description',
            type: 'tiptap',
            path: 'card.description',
          },
          {
            label: 'Agent',
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
            label: 'Other Files (optional)',
            accept: 'image/jpeg, image/png, image/gif, application/pdf',
            id: 'CardFiles',
            type: 'multifile',
            path: 'card.files',
          },
        ]}
        onSubmit={formHooks.handleSubmit(UpdateHiringCard, console.warn)}
        className="overflow-y-auto fixed-form-height"
      />
      <div className="fixed bottom-0 right-0 left-0 bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button
          type="submit"
          form={title}
          className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
          Submit
        </button>
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={handleClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export function QuickEditCard({
  card,
  usernameOptions,
  projectOptions,
  stateOptions,
  formHooks,
  cols,
}: {
  card: TCard;
  usernameOptions: Option[];
  projectOptions: Option[];
  stateOptions: Option[];
  formHooks: UseFormReturn<UpdateHiringCardInput, object>;
  cols: TWorkflowState[];
}) {
  const reset = () => {
    formHooks.reset();
  };

  const queryClient = useQueryClient();
  const UpdateHiringCardMutation = useUpdateHiringCardMutation({
    onSuccess: (data) => {
      toast.success('Card updated!');
      const id = data.updateHiringCard?.id;
      if (id) {
        queryClient.refetchQueries(useCardByIdsQuery.getKey({ ids: [id] }));
      }
    },
    onError: (error) => {
      toast.error(`Error updating card ${error.message}`);
    },
  });
  const moveCardMutation = useMoveCardMutation({
    ...defaultMutationProps(queryClient, workflowId),
  });

  const UpdateHiringCard = (input: UpdateHiringCardInput) => {
    const { workflowState, project, owners, ...cardInput } = input;
    const cardData: UpdateHiringCardMutationVariables = {
      card: {
        ...cardInput.card,
        workflowProjectId: project?.value,
        currentOwnerUsernames: owners?.map((o) => o.value),
      },
      cardId: input.cardId,
    };

    const newState = cols.find((c) => c.id === workflowState?.value);
    const oldState = cols.find((c) =>
      c.cards?.find((wfCard) => wfCard?.id === card.id),
    );
    if (card && !_.isEqual(cardData.card, card)) {
      UpdateHiringCardMutation.mutate({
        card: cardData.card,
        cardId: input.cardId,
      });
    }
    if (newState && newState.id !== oldState?.id) {
      moveCardMutation.mutate({
        workflowStateId: newState.id,
        cardId: input.cardId,
        previousCard: 'end',
      });
    }
    formHooks.reset(input);
  };
  const onSubmit = formHooks.handleSubmit(UpdateHiringCard, () =>
    toast.error(`WoopsieDoopsy, the form is invalid`),
  );

  const isMobile = useMobileDetect().isMobile();

  const { isDirty } = useFormState(formHooks);

  const isEditing = isDirty;

  useDirty({ isDirty });

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (!isEditing || isMobile || event.isComposing) {
        return;
      }

      if (event.code === 'KeyS' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        onSubmit();
      }
      if (event.code === 'Esc' || event.code === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        reset();
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [onSubmit]);

  const title = 'Quick Edit Card';
  return (
    <div className="relative h-full w-full text-left">
      {isEditing && (
        <div className="fixed z-20 top-0 right-0 left-0 bg-red-50 px-4 py-4">
          {isMobile ? (
            <div className="flex justify-around items-center w-full mx-1">
              <strong className="prose">Editing Card</strong>
              <div className="space-x-4 w-2/5 flex-nowrap flex">
                <Button primary onClick={onSubmit}>
                  Save
                </Button>
                <Button
                  onClick={() => {
                    reset();
                  }}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-center">
              Editing... Press ESC to cancel or Ctrl/Cmd+S to save
            </p>
          )}
        </div>
      )}
      <Form
        title={title}
        formHooks={formHooks}
        fields={[
          {
            id: 'owners',
            label: 'Owners',
            type: 'multiselect',
            options: usernameOptions,
            path: 'owners',
          },
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
            label: 'Agent',
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
            label: 'Description',
            id: 'desc',
            type: 'tiptap',
            path: 'card.description',
          },
        ]}
        className="overflow-y-auto fixed-form-height"
      />
    </div>
  );
}

export function QuickEditCardWrapper({ cardId }: { cardId: string }) {
  const { card } = useCardById(cardId);
  const cols = useWorkflowStates({ workflowId }).data || [];
  const stateOptions = cols.map((c) => ({
    label: c.name,
    value: c.id,
  }));
  const projectOptions = useProjectOptions(workflowId);
  const usernameOptions = juxters.map((user) => ({
    label: user.name,
    value: user.staffRecord.juxtcode,
  }));
  const formHooks = useForm<UpdateHiringCardInput>({
    defaultValues: {
      card,
      cardId: card?.id,
      owners: usernameOptions.filter((user) =>
        card?.currentOwnerUsernames?.includes(user.value),
      ),
      project: projectOptions?.find((p) => p.value === card?.project?.id),
      workflowState: stateOptions?.find(
        (s) => s.value === card?.workflowState?.id,
      ),
    },
  });

  return (
    <>
      {card && (
        <QuickEditCard
          card={card}
          usernameOptions={usernameOptions}
          projectOptions={projectOptions}
          stateOptions={stateOptions}
          formHooks={formHooks}
          cols={cols}
        />
      )}
    </>
  );
}
