import { ModalStateProps, Option } from "../types";
import { useForm } from "react-hook-form";
import { ModalForm } from "./Modal";
import {
  CreateProjectMutationVariables,
  useAllProjectsQuery,
  useCreateProjectMutation,
} from "../generated/graphql";
import { defaultMutationProps, distinctBy, notEmpty } from "../kanbanHelpers";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";

type AddProjectInput = Omit<
  CreateProjectMutationVariables,
  "projectStateIds"
> & {
  projectStateIds: Option[] | undefined;
};

type AddProjectModalProps = ModalStateProps;

export function AddProjectModal({ isOpen, setIsOpen }: AddProjectModalProps) {
  const queryClient = useQueryClient();
  const addProjectMutation = useCreateProjectMutation({
    onSettled: () => {
      queryClient.refetchQueries(useAllProjectsQuery.getKey());
    },
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
