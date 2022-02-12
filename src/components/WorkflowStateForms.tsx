import {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {useSearch} from 'react-location';
import {useQueryClient} from 'react-query';
import {
  CreateWorkflowStateMutationVariables,
  UpdateWorkflowStateMutationVariables,
  useCreateWorkflowStateMutation,
  useUpdateWorkflowStateMutation,
} from '../generated/graphql';
import {useWorkflowState, useWorkflowStates} from '../hooks';
import {defaultMutationProps} from '../kanbanHelpers';
import {LocationGenerics, ModalStateProps} from '../types';
import {ModalForm} from './Modal';

type AddWorkflowStateInput = Omit<
  CreateWorkflowStateMutationVariables,
  'colId' | 'workflowStateIds' | 'workflowId'
>;

type AddWorkflowStateModalProps = ModalStateProps;

export function AddWorkflowStateModal({
  isOpen,
  handleClose,
}: AddWorkflowStateModalProps) {
  const queryClient = useQueryClient();
  const addColMutation = useCreateWorkflowStateMutation({
    ...defaultMutationProps(queryClient),
  });
  const {modalState} = useSearch<LocationGenerics>();
  const workflowId = modalState?.workflowId;
  const cols = useWorkflowStates().data || [];

  const addWorkflowState = (col: AddWorkflowStateInput) => {
    if (workflowId) {
      handleClose();
      const colId = `col-${Date.now()}`;
      addColMutation.mutate({
        ...col,
        workflowStateIds: [...cols.map((c) => c.id), colId],
        workflowId,
        colId,
      });
    }
  };
  const formHooks = useForm<AddWorkflowStateInput>();
  return (
    <ModalForm<AddWorkflowStateInput>
      title="Add WorkflowState"
      formHooks={formHooks}
      onSubmit={formHooks.handleSubmit(addWorkflowState, console.warn)}
      isOpen={isOpen}
      handleClose={handleClose}
      fields={[
        {
          id: 'name',
          path: 'workflowStateName',
          rules: {
            required: true,
          },
          label: 'WorkflowState Name',
          type: 'text',
        },
      ]}
    />
  );
}

type UpdateWorkflowStateInput = Omit<
  UpdateWorkflowStateMutationVariables,
  'colId' | 'workflowStateIds' | 'workflowId'
>;

type UpdateWorkflowStateModalProps = ModalStateProps;

export function UpdateWorkflowStateModal({
  isOpen,
  handleClose,
}: UpdateWorkflowStateModalProps) {
  const queryClient = useQueryClient();
  const updateColMutation = useUpdateWorkflowStateMutation({
    ...defaultMutationProps(queryClient),
  });
  const {modalState} = useSearch<LocationGenerics>();
  const colId = modalState?.workflowStateId;
  const workflowState = useWorkflowState(colId)?.data;

  const updateWorkflowState = (col: UpdateWorkflowStateInput) => {
    if (colId) {
      handleClose();
      updateColMutation.mutate({
        ...col,
        colId,
      });
    }
  };
  const formHooks = useForm<UpdateWorkflowStateInput>();
  useEffect(() => {
    if (workflowState) {
      formHooks.setValue('name', workflowState.name);
      if (workflowState?.description) {
        formHooks.setValue('description', workflowState.description);
      }
    }
  }, [workflowState]);

  return (
    <ModalForm<UpdateWorkflowStateInput>
      title="Update Column"
      formHooks={formHooks}
      onSubmit={formHooks.handleSubmit(updateWorkflowState, console.warn)}
      isOpen={isOpen}
      handleClose={handleClose}
      fields={[
        {
          id: 'name',
          path: 'name',
          rules: {
            required: true,
          },
          label: 'Column Name',
          type: 'text',
        },
        {
          id: 'description',
          path: 'description',
          label: 'Description',
          type: 'text',
        },
      ]}
    />
  );
}
