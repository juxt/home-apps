import { MakeGenerics } from 'react-location';
import {
  KanbanDataQuery,
  CardFieldsFragment,
  WorkflowStateFieldsFragment,
} from '../generated/graphql';

export type TWorkflow = NonNullable<KanbanDataQuery['workflow']>;
export type TCard = CardFieldsFragment;
export type TWorkflowState = WorkflowStateFieldsFragment;

export type WorkflowFormModalTypes =
  | 'addCard'
  | 'addProject'
  | 'addWorkflowState'
  | 'addWorkflow'
  | 'editProject'
  | 'editWorkflowState'
  | 'editCard'
  | null
  | false
  | undefined;

export type LocationGenerics = MakeGenerics<{
  Search: {
    modalState: {
      formModalType: WorkflowFormModalTypes;
      workflowProjectId?: string;
      workflowStateId?: string;
      cardId?: string;
      isEditing?: boolean;
    };
    workflowProjectId?: string;
    cardModalView?: string;
    view?: 'card' | 'table';
    filters?: {
      [key: string]: string[];
    };
    showDetails?: boolean;
    devMode?: boolean;
  };
}>;
