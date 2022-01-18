import { ModalStateProps, Option } from "../types";
import { useForm } from "react-hook-form";
import { ModalForm } from "./Modal";
import {
  CreateWorkflowMutationVariables,
  useCreateWorkflowMutation,
} from "../generated/graphql";
import { defaultMutationProps, distinctBy } from "../kanbanHelpers";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useStatesOptions } from "../hooks";

type AddWorkflowInput = Omit<
  CreateWorkflowMutationVariables,
  "workflowStateIds"
> & {
  workflowStateIds: Option[] | undefined;
};

type AddWorkflowModalProps = ModalStateProps;

export function AddWorkflowModal({ isOpen, setIsOpen }: AddWorkflowModalProps) {
  const queryClient = useQueryClient();
  const addWorkflowMutation = useCreateWorkflowMutation({
    ...defaultMutationProps(queryClient),
  });

  const addWorkflow = (input: AddWorkflowInput) => {
    setIsOpen(false);
    const { workflowStateIds, ...workflowInput } = input;

    const newWorkflowStates =
      workflowStateIds?.map((c) => {
        return {
          name: c.label,
          id: "col" + Math.random().toString(),
        };
      }) || [];
    const data = {
      ...workflowInput,
      workflowStates: newWorkflowStates,
      workflowStateIds: newWorkflowStates?.map((c) => c.id),
    };
    toast.promise(addWorkflowMutation.mutateAsync(data), {
      pending: "Creating workflow...",
      success: "Workflow created!",
      error: "Error creating workflow",
    });
  };

  const formHooks = useForm<AddWorkflowInput>();
  const cols = useStatesOptions();
  const workflowStates: Option[] =
    distinctBy<typeof cols[0]>(cols, "label") || [];
  return (
    <ModalForm<AddWorkflowInput>
      title="Add Workflow"
      formHooks={formHooks}
      fields={[
        {
          id: "workflowStates",
          type: "multiselect",
          options: workflowStates,
          path: "workflowStateIds",
          label: "WorkflowStates",
        },
        {
          id: "WorkflowName",
          placeholder: "Workflow Name",
          type: "text",
          rules: {
            required: true,
          },
          path: "name",
        },
        {
          id: "WorkflowDescription",
          placeholder: "Workflow Description",
          type: "text",
          path: "description",
        },
      ]}
      onSubmit={formHooks.handleSubmit(addWorkflow, console.warn)}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  );
}
