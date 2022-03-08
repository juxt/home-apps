import {
  FieldArrayWithId,
  useFieldArray,
  useForm,
  UseFormReturn,
} from 'react-hook-form';
import { toast } from 'react-toastify';
import { useEffect, useMemo } from 'react';
import { useSearch } from 'react-location';
import { useQueryClient } from 'react-query';
import {
  CreateWorkflowProjectMutationVariables,
  LocationGenerics,
  useCreateWorkflowProjectMutation,
  UpdateWorkflowProjectMutationVariables,
  useUpdateWorkflowProjectMutation,
  useCurrentProject,
  purgeAllLists,
  TProject,
  Exact,
  WorkflowProjectInput,
} from '@juxt-home/site';
import {
  ModalStateProps,
  ModalForm,
  Form,
  Modal,
  Button,
  DeleteActiveIcon,
  RenderField,
} from '@juxt-home/ui-common';
import { defaultMutationProps } from './utils';
import splitbee from '@splitbee/web';
import { notEmpty } from '@juxt-home/utils';

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

function OpenRolesForm({
  formHooks,
  openRoleIndex,
  onRemove,
}: {
  formHooks: UseFormReturn<UpdateWorkflowProjectMutationVariables, object>;
  openRoleIndex: number;
  onRemove: () => void;
}) {
  return (
    <>
      <div className="flex items-center mb-2 first:mt-0 mt-2">
        <p>Role {openRoleIndex + 1}</p>
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
      <RenderField
        field={{
          id: 'RoleCount',
          path: `workflowProject.openRoles.${openRoleIndex}.count`,
          placeholder: 'Number of currently open positions',
          type: 'number',
        }}
        props={{
          className: 'mt-2',
          formHooks,
        }}
      />
      <RenderField
        field={{
          id: 'RoleName',
          placeholder: 'Role Name',
          path: `workflowProject.openRoles.${openRoleIndex}.name`,
          type: 'text',
        }}
        props={{
          className: 'mt-2',
          formHooks,
        }}
      />
    </>
  );
}

function OpenRolesArray({
  formHooks,
}: {
  formHooks: UseFormReturn<UpdateWorkflowProjectMutationVariables, object>;
}) {
  const { control } = formHooks;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'workflowProject.openRoles',
  });
  return (
    <div className="py-2">
      {fields.map((field, i) => (
        <OpenRolesForm
          key={field.id}
          formHooks={formHooks}
          openRoleIndex={i}
          onRemove={() => remove(i)}
        />
      ))}
      <Button primary noMargin className="mt-2 p-0" onClick={() => append({})}>
        Add Open Role
      </Button>
    </div>
  );
}

type UpdateWorkflowProjectInput = UpdateWorkflowProjectMutationVariables;

type UpdateWorkflowProjectModalProps = ModalStateProps & {
  workflowId: string;
  project: TProject;
};

function UpdateWorkflowProjectModal({
  isOpen,
  handleClose,
  project,
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
  const defaultValues = useMemo(
    () => ({
      workflowProjectId,
      workflowProject: {
        ...project,
        openRoles: project.openRoles?.filter(notEmpty) ?? [],
      },
    }),
    [workflowProjectId, project],
  );

  const formHooks = useForm<UpdateWorkflowProjectInput>({
    defaultValues,
  });

  useEffect(() => {
    formHooks.reset({ ...defaultValues });
  }, [defaultValues, formHooks, project]);

  const title = 'Update Project';
  return (
    <Modal key={project.name} isOpen={isOpen} handleClose={handleClose}>
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
          {
            type: 'custom',
            component: <OpenRolesArray formHooks={formHooks} />,
            label: 'Open Roles',
            path: 'workflowProject.openRoles',
          },
        ]}
        onSubmit={formHooks.handleSubmit(UpdateWorkflowProject, console.warn)}
      />
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

export function UpdateWorkflowProjectModalWrapper({
  isOpen,
  handleClose,
  workflowId,
}: Omit<UpdateWorkflowProjectModalProps, 'project'>) {
  const { data: project, isLoading } = useCurrentProject(workflowId);
  return (
    <>
      {isLoading && <div>Loading...</div>}
      {project && (
        <UpdateWorkflowProjectModal
          {...{ isOpen, handleClose, project, workflowId }}
        />
      )}
    </>
  );
}
