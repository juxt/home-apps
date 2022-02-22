import * as yup from 'yup'
import { CommentInput, FileInput, HiringCardInput, WorkflowProjectInput, WorkflowStateInput, WorkflowStateType } from './graphql'

export function CommentInputSchema(): yup.SchemaOf<CommentInput> {
  return yup.object({
    cardId: yup.string().required(),
    parentId: yup.string(),
    text: yup.string().required()
  })
}

export function FileInputSchema(): yup.SchemaOf<FileInput> {
  return yup.object({
    base64: yup.string().required(),
    name: yup.string().required(),
    type: yup.string().required()
  })
}

export function HiringCardInputSchema(): yup.SchemaOf<HiringCardInput> {
  return yup.object({
    agent: yup.string(),
    createdAt: yup.string(),
    currentOwnerUsernames: yup.array().of(yup.string()).optional(),
    cvPdf: yup.lazy(() => FileInputSchema()) as never,
    description: yup.string(),
    files: yup.array().of(yup.lazy(() => FileInputSchema()) as never).optional(),
    languages: yup.array().of(yup.string()).optional(),
    location: yup.string(),
    stateStr: yup.string(),
    taskHtml: yup.string(),
    title: yup.string(),
    workflowId: yup.string(),
    workflowProjectId: yup.string()
  })
}

export function WorkflowProjectInputSchema(): yup.SchemaOf<WorkflowProjectInput> {
  return yup.object({
    description: yup.string(),
    id: yup.string(),
    name: yup.string().required()
  })
}

export function WorkflowStateInputSchema(): yup.SchemaOf<WorkflowStateInput> {
  return yup.object({
    cardIds: yup.array().of(yup.string()).optional(),
    description: yup.string(),
    id: yup.string(),
    name: yup.string(),
    roles: yup.array().of(yup.string()).optional(),
    tasks: yup.array().of(yup.string()).optional()
  })
}

export const WorkflowStateTypeSchema = yup.mixed().oneOf([WorkflowStateType.Done, WorkflowStateType.Started, WorkflowStateType.Unstarted]);
