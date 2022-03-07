import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useSearch } from 'react-location';
import { useQueryClient } from 'react-query';
import {
  CreateWorkflowProjectMutationVariables,
  LocationGenerics,
  useCreateWorkflowProjectMutation,
  UpdateWorkflowProjectMutationVariables,
  useUpdateWorkflowProjectMutation,
  useCurrentProject,
} from '@juxt-home/site';
import { ModalStateProps, ModalForm, Form, Modal } from '@juxt-home/ui-common';
import { defaultMutationProps, purgeAllLists } from './utils';
import splitbee from '@splitbee/web';

type AddProjectInput = CreateWorkflowProjectMutationVariables;

type AddProjectModalProps = ModalStateProps;

export function AddProjectModal({ isOpen, handleClose }: AddProjectModalProps) {
  const addProjectMutation = useCreateWorkflowProjectMutation({
    ...defaultMutationProps,
    onSuccess: (data) => {
      splitbee.track('Add Project', {
        data: JSON.stringify(data),
      });
    },
  });

  const addProject = (input: AddProjectInput) => {
    handleClose();
    purgeAllLists();
    toast.promise(addProjectMutation.mutateAsync(input), {
      pending: 'Creating project...',
      success: 'Project created!',
      error: 'Error creating project',
    });
  };

  const formHooks = useForm<AddProjectInput>();

  return (
    <ModalForm<AddProjectInput>
      title="Add Project"
      formHooks={formHooks}
      fields={[
        {
          id: 'ProjectName',
          placeholder: 'Project Name',
          label: 'Project Name',
          type: 'text',
          rules: {
            required: true,
          },
          path: 'workflowProject.name',
        },
        {
          id: 'ProjectDescription',
          label: 'Project Description',
          placeholder: 'Project Description',
          type: 'text',
          path: 'workflowProject.description',
        },
      ]}
      onSubmit={formHooks.handleSubmit(addProject, console.warn)}
      isOpen={isOpen}
      handleClose={handleClose}
    />
  );
}

type UpdateWorkflowProjectInput = UpdateWorkflowProjectMutationVariables;

type UpdateWorkflowProjectModalProps = ModalStateProps & {
  workflowId: string;
};

export function UpdateWorkflowProjectModal({
  isOpen,
  handleClose,
  workflowId,
}: UpdateWorkflowProjectModalProps) {
  const { modalState } = useSearch<LocationGenerics>();
  const workflowProjectId = modalState?.workflowProjectId;
  const queryClient = useQueryClient();
  const UpdateWorkflowProjectMutation = useUpdateWorkflowProjectMutation({
    ...defaultMutationProps(queryClient, workflowId),
    onSuccess: (data) => {
      splitbee.track('Update Project', {
        data: JSON.stringify(data),
      });
    },
  });

  const UpdateWorkflowProject = (input: UpdateWorkflowProjectInput) => {
    handleClose();
    UpdateWorkflowProjectMutation.mutate({ ...input });
  };

  const project = useCurrentProject(workflowId).data;

  const formHooks = useForm<UpdateWorkflowProjectInput>({
    defaultValues: {
      workflowProjectId,
    },
  });

  useEffect(() => {
    if (project) {
      formHooks.setValue('workflowProject', { ...project });
    }
  }, [formHooks, project]);

  const title = 'Update Project';
  return (
    <Modal isOpen={isOpen} handleClose={handleClose}>
      <div>
        <Form
          title={title}
          formHooks={formHooks}
          fields={[
            {
              id: 'ProjectName',
              placeholder: 'Project Name',
              type: 'text',
              rules: {
                required: true,
              },
              path: 'workflowProject.name',
              label: 'Name',
            },
            {
              id: 'ProjectDescription',
              label: 'Project Description',
              placeholder: 'Project Description',
              type: 'text',
              path: 'workflowProject.description',
            },
          ]}
          onSubmit={formHooks.handleSubmit(UpdateWorkflowProject, console.warn)}
        />
      </div>
      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button
          type="submit"
          form={title}
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
          Submit
        </button>
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={() => handleClose()}>
          Cancel
        </button>
      </div>
    </Modal>
  );
}
