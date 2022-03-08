import * as yup from 'yup'
import { CommentInput, FileInput, GrowResourceInput, GrowTagInput, HiringCardInput, HiringQuestionInput, HiringScoreCardInput, InterviewFeedbackInput, OpenRoleInput, WorkflowProjectInput, WorkflowStateInput, WorkflowStateType } from './graphql'

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

export function GrowResourceInputSchema(): yup.SchemaOf<GrowResourceInput> {
  return yup.object({
    category: yup.string(),
    description: yup.string(),
    descriptionHTML: yup.string(),
    foo: yup.string(),
    id: yup.string(),
    name: yup.string(),
    tagIds: yup.array().of(yup.string()).optional(),
    type: yup.string(),
    url: yup.string()
  })
}

export function GrowTagInputSchema(): yup.SchemaOf<GrowTagInput> {
  return yup.object({
    id: yup.string().required(),
    name: yup.string().required()
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

export function HiringQuestionInputSchema(): yup.SchemaOf<HiringQuestionInput> {
  return yup.object({
    description: yup.string(),
    preSet: yup.boolean(),
    question: yup.string().required(),
    response: yup.string().required(),
    scoreCards: yup.array().of(yup.lazy(() => HiringScoreCardInputSchema().defined()) as never).defined(),
    scoreCardsLabel: yup.string()
  })
}

export function HiringScoreCardInputSchema(): yup.SchemaOf<HiringScoreCardInput> {
  return yup.object({
    description: yup.string(),
    preSet: yup.boolean(),
    score: yup.number().defined(),
    text: yup.string().required()
  })
}

export function InterviewFeedbackInputSchema(): yup.SchemaOf<InterviewFeedbackInput> {
  return yup.object({
    cardId: yup.string().required(),
    id: yup.string().required(),
    overallScore: yup.number().defined(),
    questions: yup.array().of(yup.lazy(() => HiringQuestionInputSchema().defined()) as never).defined(),
    summary: yup.string().required()
  })
}

export function OpenRoleInputSchema(): yup.SchemaOf<OpenRoleInput> {
  return yup.object({
    count: yup.number().defined(),
    name: yup.string().required()
  })
}

export function WorkflowProjectInputSchema(): yup.SchemaOf<WorkflowProjectInput> {
  return yup.object({
    description: yup.string(),
    id: yup.string(),
    name: yup.string().required(),
    openRoles: yup.array().of(yup.lazy(() => OpenRoleInputSchema()) as never).optional()
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
