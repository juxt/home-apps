import { LocationGenerics, ModalStateProps, Option } from "../types";
import { useForm } from "react-hook-form";
import { Modal, ModalForm } from "./Modal";
import {
  CreateProjectMutationVariables,
  UpdateProjectMutationVariables,
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from "../generated/graphql";
import { toast } from "react-toastify";
import {
  defaultMutationProps,
  notEmpty,
  uncompressBase64,
} from "../kanbanHelpers";
import { useEffect } from "react";
import { useSearch } from "react-location";
import { useQueryClient } from "react-query";
import { useCurrentProject, useProjectOptions } from "../hooks";
import { Form } from "./Form";

type AddProjectInput = Omit<
  CreateProjectMutationVariables,
  "projectStateIds"
> & {
  projectStateIds: Option[] | undefined;
};

type AddProjectModalProps = ModalStateProps;

export function AddProjectModal({ isOpen, setIsOpen }: AddProjectModalProps) {
  const addProjectMutation = useCreateProjectMutation({
    ...defaultMutationProps,
  });

  const addProject = (input: AddProjectInput) => {
    setIsOpen(false);
    const { projectStateIds, ...projectInput } = input;

    const newProjectStates =
      projectStateIds?.map((c) => {
        return {
          name: c.label,
          id: "col" + Math.random().toString(),
        };
      }) || [];
    const data = {
      ...projectInput,
      projectStates: newProjectStates,
      projectStateIds: newProjectStates?.map((c) => c.id),
    };
    toast.promise(addProjectMutation.mutateAsync(data), {
      pending: "Creating project...",
      success: "Project created!",
      error: "Error creating project",
    });
  };

  const formHooks = useForm<AddProjectInput>();

  return (
    <ModalForm<AddProjectInput>
      title="Add Project"
      formHooks={formHooks}
      fields={[
        {
          id: "ProjectName",
          placeholder: "Project Name",
          label: "Project Name",
          type: "text",
          rules: {
            required: true,
          },
          path: "project.name",
        },
        {
          id: "ProjectDescription",
          label: "Project Description",
          placeholder: "Project Description",
          type: "text",
          path: "project.description",
        },
      ]}
      onSubmit={formHooks.handleSubmit(addProject, console.warn)}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  );
}

type UpdateProjectInput = UpdateProjectMutationVariables;

type UpdateProjectModalProps = ModalStateProps;

export function UpdateProjectModal({
  isOpen,
  setIsOpen,
}: UpdateProjectModalProps) {
  const { modalState } = useSearch<LocationGenerics>();
  const projectId = modalState?.projectId;
  const queryClient = useQueryClient();
  const updateProjectMutation = useUpdateProjectMutation({
    ...defaultMutationProps(queryClient),
  });

  const updateProject = (input: UpdateProjectInput) => {
    setIsOpen(false);
    updateProjectMutation.mutate({ ...input });
  };

  const project = useCurrentProject().data;

  const formHooks = useForm<UpdateProjectInput>({
    defaultValues: {
      projectId,
    },
  });

  useEffect(() => {
    if (project) {
      formHooks.setValue("project", { ...project });
    }
  }, [project]);

  const title = "Update Project";
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div>
        <Form
          title={title}
          formHooks={formHooks}
          fields={[
            {
              id: "ProjectName",
              placeholder: "Project Name",
              type: "text",
              rules: {
                required: true,
              },
              path: "project.name",
              label: "Name",
            },
            {
              id: "ProjectDescription",
              label: "Project Description",
              placeholder: "Project Description",
              type: "text",
              path: "project.description",
            },
          ]}
          onSubmit={formHooks.handleSubmit(updateProject, console.warn)}
        />
      </div>
      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button
          type="submit"
          form={title}
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Submit
        </button>
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
