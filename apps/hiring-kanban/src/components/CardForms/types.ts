import {
  CreateHiringCardMutationVariables,
  UpdateHiringCardMutationVariables,
} from '@juxt-home/site';
import { ModalStateProps, Option } from '@juxt-home/ui-common';

export type AddHiringCardInput = CreateHiringCardMutationVariables & {
  project: Option;
  workflowState: Option;
};

export type AddHiringCardModalProps = ModalStateProps;
export type EditCardModalProps = ModalStateProps;
export type UpdateHiringCardInput = UpdateHiringCardMutationVariables & {
  project: Option;
  workflowState: Option;
};
