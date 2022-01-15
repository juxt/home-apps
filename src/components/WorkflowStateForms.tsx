import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearch } from "react-location";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import {
  CreateWorkflowStateMutationVariables,
  UpdateWorkflowStateMutationVariables,
  useCreateWorkflowStateMutation,
  useUpdateWorkflowStateMutation,
} from "../generated/graphql";
import { defaultMutationProps, mapKeys, notEmpty } from "../kanbanHelpers";
import { LocationGenerics, ModalStateProps, TWorkflow } from "../types";
import { ModalForm } from "./Modal";

type AddWorkflowStateInput = Omit<
  Omit<Omit<CreateWorkflowStateMutationVariables, "colId">, "workflowStateIds">,
  "workflowId"
>;

type AddWorkflowStateModalProps = ModalStateProps;

export function AddWorkflowStateModal({
  isOpen,
  setIsOpen,
}: AddWorkflowStateModalProps) {
  const queryClient = useQueryClient();
  const addColMutation = useCreateWorkflowStateMutation({
    ...defaultMutationProps(queryClient),
  });
  const { modalState } = useSearch<LocationGenerics>();
  const workflow = modalState?.workflow;
  const cols = workflow?.workflowStates.filter(notEmpty) ?? [];
  const addWorkflowState = (col: AddWorkflowStateInput) => {
    if (workflow) {
      setIsOpen(false);
      const colId = `col-${Date.now()}`;
      addColMutation.mutate({
        ...col,
        workflowStateIds: [...cols.map((c) => c.id), colId],
        workflowId: workflow.id,
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
      setIsOpen={setIsOpen}
      fields={[
        {
          id: "name",
          path: "workflowStateName",
          rules: {
            required: true,
          },
          label: "WorkflowState Name",
          type: "text",
        },
      ]}
    />
  );
}

type UpdateWorkflowStateInput = Omit<
  Omit<Omit<UpdateWorkflowStateMutationVariables, "colId">, "workflowStateIds">,
  "workflowId"
>;

type UpdateWorkflowStateModalProps = ModalStateProps;

export function UpdateWorkflowStateModal({
  isOpen,
  setIsOpen,
}: UpdateWorkflowStateModalProps) {
  const queryClient = useQueryClient();
  const updateColMutation = useUpdateWorkflowStateMutation({
    ...defaultMutationProps(queryClient),
  });
  const { modalState } = useSearch<LocationGenerics>();
  const workflowState = modalState?.workflowState;
  const colId = workflowState?.id;

  const updateWorkflowState = (col: UpdateWorkflowStateInput) => {
    if (colId) {
      setIsOpen(false);
      updateColMutation.mutate({
        ...col,
        colId,
      });
    }
  };
  const formHooks = useForm<UpdateWorkflowStateInput>();
  const formVals = formHooks.getValues();
  useEffect(() => {
    mapKeys(formVals, (key) => {
      workflowState && formHooks.setValue(key, workflowState[key]);
      return key;
    });
  }, [workflowState, formVals]);
  return (
    <ModalForm<UpdateWorkflowStateInput>
      title="Update WorkflowState"
      formHooks={formHooks}
      onSubmit={formHooks.handleSubmit(updateWorkflowState, console.warn)}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      fields={[
        {
          id: "name",
          path: "name",
          rules: {
            required: true,
          },
          label: "WorkflowState Name",
          type: "text",
        },
        {
          id: "description",
          path: "description",
          label: "Description",
          type: "text",
        },
      ]}
    />
  );
}
