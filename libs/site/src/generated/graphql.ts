import { useQuery, UseQueryOptions, useMutation, UseMutationOptions } from 'react-query';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables>(query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch("https://alexd.uk/kanban/graphql", {
    method: "POST",
    ...({"headers":{"Content-Type":"application/json","Accept":"application/json"},"credentials":"include"}),
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  }
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Card = HiringCard;

export type Comment = {
  __typename?: 'Comment';
  _siteCreatedAt: Scalars['String'];
  _siteQuery?: Maybe<Scalars['String']>;
  _siteSubject?: Maybe<Scalars['String']>;
  _siteValidTime: Scalars['String'];
  card?: Maybe<Card>;
  children?: Maybe<Array<Maybe<Comment>>>;
  id: Scalars['ID'];
  parentId?: Maybe<Scalars['String']>;
  text: Scalars['String'];
};

export type CommentInput = {
  cardId: Scalars['ID'];
  parentId?: InputMaybe<Scalars['ID']>;
  text: Scalars['String'];
};

export type File = {
  __typename?: 'File';
  base64: Scalars['String'];
  name: Scalars['String'];
  type: Scalars['String'];
};

export type FileInput = {
  base64: Scalars['String'];
  name: Scalars['String'];
  type: Scalars['String'];
};

export type HiringCard = {
  __typename?: 'HiringCard';
  _siteSubject?: Maybe<Scalars['ID']>;
  _siteValidTime: Scalars['String'];
  agent?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  currentOwnerUsernames?: Maybe<Array<Maybe<Scalars['String']>>>;
  cvPdf?: Maybe<File>;
  description?: Maybe<Scalars['String']>;
  files?: Maybe<Array<Maybe<File>>>;
  id: Scalars['ID'];
  languages?: Maybe<Array<Maybe<Scalars['String']>>>;
  location?: Maybe<Scalars['String']>;
  project?: Maybe<WorkflowProject>;
  stateStr?: Maybe<Scalars['String']>;
  taskHtml?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  workflow?: Maybe<Workflow>;
  workflowState?: Maybe<WorkflowState>;
};

export type HiringCardInput = {
  agent?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['String']>;
  currentOwnerUsernames?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  cvPdf?: InputMaybe<FileInput>;
  description?: InputMaybe<Scalars['String']>;
  files?: InputMaybe<Array<InputMaybe<FileInput>>>;
  languages?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  location?: InputMaybe<Scalars['String']>;
  stateStr?: InputMaybe<Scalars['String']>;
  taskHtml?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  workflowId?: InputMaybe<Scalars['ID']>;
  workflowProjectId?: InputMaybe<Scalars['ID']>;
};

export type HiringQuestion = {
  __typename?: 'HiringQuestion';
  description?: Maybe<Scalars['String']>;
  question: Scalars['String'];
  response?: Maybe<Scalars['String']>;
  scoreCards?: Maybe<Array<Maybe<HiringScoreCard>>>;
  scoreCardsLabel?: Maybe<Scalars['String']>;
};

export type HiringQuestionInput = {
  description?: InputMaybe<Scalars['String']>;
  preSet?: InputMaybe<Scalars['Boolean']>;
  question: Scalars['String'];
  response: Scalars['String'];
  scoreCards: Array<HiringScoreCardInput>;
  scoreCardsLabel?: InputMaybe<Scalars['String']>;
};

export type HiringScoreCard = {
  __typename?: 'HiringScoreCard';
  description?: Maybe<Scalars['String']>;
  score?: Maybe<Scalars['Int']>;
  text: Scalars['String'];
};

export type HiringScoreCardInput = {
  description?: InputMaybe<Scalars['String']>;
  preSet?: InputMaybe<Scalars['Boolean']>;
  score: Scalars['Int'];
  text: Scalars['String'];
};

export type InterviewFeedback = {
  __typename?: 'InterviewFeedback';
  _siteCreatedAt: Scalars['String'];
  _siteQuery?: Maybe<Scalars['String']>;
  _siteSubject?: Maybe<Scalars['String']>;
  _siteValidTime: Scalars['String'];
  card?: Maybe<Card>;
  id: Scalars['ID'];
  overallScore: Scalars['Int'];
  questions?: Maybe<Array<Maybe<HiringQuestion>>>;
  summary: Scalars['String'];
};

export type InterviewFeedbackInput = {
  cardId: Scalars['ID'];
  id: Scalars['ID'];
  overallScore: Scalars['Int'];
  questions: Array<HiringQuestionInput>;
  summary: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createComment?: Maybe<Comment>;
  createHiringCard?: Maybe<HiringCard>;
  createInterviewFeedback?: Maybe<InterviewFeedback>;
  createWorkflow?: Maybe<Workflow>;
  createWorkflowProject?: Maybe<WorkflowProject>;
  createWorkflowProjects?: Maybe<Array<Maybe<WorkflowProject>>>;
  createWorkflowState?: Maybe<WorkflowState>;
  createWorkflowStates?: Maybe<Array<Maybe<WorkflowState>>>;
  deleteComment?: Maybe<Comment>;
  deleteHiringCard?: Maybe<HiringCard>;
  deleteWorkflow?: Maybe<Workflow>;
  deleteWorkflowProject?: Maybe<WorkflowProject>;
  deleteWorkflowState?: Maybe<WorkflowState>;
  moveCard?: Maybe<Card>;
  rollbackCard?: Maybe<HiringCard>;
  updateHiringCard?: Maybe<HiringCard>;
  updateWorkflow?: Maybe<Workflow>;
  updateWorkflowProject?: Maybe<WorkflowProject>;
  updateWorkflowState?: Maybe<WorkflowState>;
  updatecomment?: Maybe<Comment>;
};


export type MutationCreateCommentArgs = {
  Comment?: InputMaybe<CommentInput>;
};


export type MutationCreateHiringCardArgs = {
  Card?: InputMaybe<HiringCardInput>;
};


export type MutationCreateInterviewFeedbackArgs = {
  interviewFeedback: InterviewFeedbackInput;
};


export type MutationCreateWorkflowArgs = {
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
  workflowStateIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};


export type MutationCreateWorkflowProjectArgs = {
  workflowProject?: InputMaybe<WorkflowProjectInput>;
};


export type MutationCreateWorkflowProjectsArgs = {
  workflowProjects?: InputMaybe<Array<InputMaybe<WorkflowProjectInput>>>;
};


export type MutationCreateWorkflowStateArgs = {
  WorkflowState?: InputMaybe<WorkflowStateInput>;
};


export type MutationCreateWorkflowStatesArgs = {
  workflowStates?: InputMaybe<Array<InputMaybe<WorkflowStateInput>>>;
};


export type MutationDeleteCommentArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteHiringCardArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteWorkflowArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteWorkflowProjectArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteWorkflowStateArgs = {
  id: Scalars['ID'];
};


export type MutationMoveCardArgs = {
  cardId: Scalars['ID'];
  previousCard?: InputMaybe<Scalars['ID']>;
  workflowStateId: Scalars['ID'];
};


export type MutationRollbackCardArgs = {
  asOf: Scalars['String'];
  id: Scalars['ID'];
};


export type MutationUpdateHiringCardArgs = {
  Card?: InputMaybe<HiringCardInput>;
  id: Scalars['ID'];
};


export type MutationUpdateWorkflowArgs = {
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  workflowStateIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};


export type MutationUpdateWorkflowProjectArgs = {
  id: Scalars['ID'];
  workflowProject?: InputMaybe<WorkflowProjectInput>;
};


export type MutationUpdateWorkflowStateArgs = {
  id: Scalars['ID'];
  workflowState?: InputMaybe<WorkflowStateInput>;
};


export type MutationUpdatecommentArgs = {
  Comment?: InputMaybe<CommentInput>;
  id: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  allComments?: Maybe<Array<Maybe<Comment>>>;
  allHiringCards?: Maybe<Array<Maybe<HiringCard>>>;
  allWorkflowProjects?: Maybe<Array<Maybe<WorkflowProject>>>;
  allWorkflowStates?: Maybe<Array<Maybe<WorkflowState>>>;
  allWorkflows?: Maybe<Array<Maybe<Workflow>>>;
  cardHistory?: Maybe<Array<Maybe<Card>>>;
  cardsByIds?: Maybe<Array<Maybe<Card>>>;
  cardsForProject?: Maybe<Array<Maybe<Card>>>;
  commentsForEntity?: Maybe<Array<Maybe<Comment>>>;
  myJuxtcode?: Maybe<Scalars['String']>;
  workflow?: Maybe<Workflow>;
  workflowState?: Maybe<WorkflowState>;
};


export type QueryAllCommentsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryCardHistoryArgs = {
  historicalDb?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryCardsByIdsArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type QueryCardsForProjectArgs = {
  id: Scalars['ID'];
};


export type QueryCommentsForEntityArgs = {
  asOf?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  limit?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Scalars['String']>;
};


export type QueryWorkflowArgs = {
  id: Scalars['ID'];
};


export type QueryWorkflowStateArgs = {
  id: Scalars['ID'];
};

export type Workflow = {
  __typename?: 'Workflow';
  _siteQuery?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  workflowStates: Array<Maybe<WorkflowState>>;
};

export type WorkflowProject = {
  __typename?: 'WorkflowProject';
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type WorkflowProjectInput = {
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
};

export type WorkflowState = {
  __typename?: 'WorkflowState';
  _siteQuery?: Maybe<Scalars['String']>;
  cards?: Maybe<Array<Maybe<Card>>>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  roles?: Maybe<Array<Maybe<Scalars['String']>>>;
  tasks?: Maybe<Array<Maybe<Scalars['String']>>>;
  type?: Maybe<WorkflowStateType>;
  workflow: Workflow;
};

export type WorkflowStateInput = {
  cardIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
  roles?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tasks?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export enum WorkflowStateType {
  Done = 'DONE',
  Started = 'STARTED',
  Unstarted = 'UNSTARTED'
}

export type AllProjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllProjectsQuery = { __typename?: 'Query', allWorkflowProjects?: Array<{ __typename?: 'WorkflowProject', id: string, name: string, description?: string | null } | null> | null };

export type CardDetailsFragment = { __typename?: 'HiringCard', id: string, description?: string | null, agent?: string | null, createdAt?: string | null, _siteValidTime: string, _siteSubject?: string | null, location?: string | null, currentOwnerUsernames?: Array<string | null> | null, taskHtml?: string | null, title: string, stateStr?: string | null, cvPdf?: { __typename?: 'File', base64: string, name: string, type: string } | null, files?: Array<{ __typename?: 'File', base64: string, name: string, type: string } | null> | null, project?: { __typename?: 'WorkflowProject', description?: string | null, id: string, name: string } | null, workflowState?: { __typename?: 'WorkflowState', id: string, name: string, tasks?: Array<string | null> | null, roles?: Array<string | null> | null } | null };

export type CardFieldsFragment = { __typename?: 'HiringCard', id: string, title: string, _siteValidTime: string, createdAt?: string | null, project?: { __typename?: 'WorkflowProject', id: string, name: string } | null };

export type CardHistoryQueryVariables = Exact<{
  id: Scalars['ID'];
  historicalDb?: InputMaybe<Scalars['Boolean']>;
}>;


export type CardHistoryQuery = { __typename?: 'Query', cardHistory?: Array<{ __typename?: 'HiringCard', id: string, description?: string | null, agent?: string | null, createdAt?: string | null, _siteValidTime: string, _siteSubject?: string | null, location?: string | null, currentOwnerUsernames?: Array<string | null> | null, taskHtml?: string | null, title: string, stateStr?: string | null, cvPdf?: { __typename?: 'File', base64: string, name: string, type: string } | null, files?: Array<{ __typename?: 'File', base64: string, name: string, type: string } | null> | null, project?: { __typename?: 'WorkflowProject', description?: string | null, id: string, name: string } | null, workflowState?: { __typename?: 'WorkflowState', id: string, name: string, tasks?: Array<string | null> | null, roles?: Array<string | null> | null } | null } | null> | null };

export type CardByIdsQueryVariables = Exact<{
  ids: Array<InputMaybe<Scalars['ID']>> | InputMaybe<Scalars['ID']>;
}>;


export type CardByIdsQuery = { __typename?: 'Query', cardsByIds?: Array<{ __typename?: 'HiringCard', id: string, description?: string | null, agent?: string | null, createdAt?: string | null, _siteValidTime: string, _siteSubject?: string | null, location?: string | null, currentOwnerUsernames?: Array<string | null> | null, taskHtml?: string | null, title: string, stateStr?: string | null, cvPdf?: { __typename?: 'File', base64: string, name: string, type: string } | null, files?: Array<{ __typename?: 'File', base64: string, name: string, type: string } | null> | null, project?: { __typename?: 'WorkflowProject', description?: string | null, id: string, name: string } | null, workflowState?: { __typename?: 'WorkflowState', id: string, name: string, tasks?: Array<string | null> | null, roles?: Array<string | null> | null } | null } | null> | null };

export type CommentsForEidQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type CommentsForEidQuery = { __typename?: 'Query', commentsForEntity?: Array<{ __typename?: 'Comment', id: string, text: string, _siteSubject?: string | null, _siteValidTime: string, _siteCreatedAt: string, children?: Array<{ __typename?: 'Comment', _siteSubject?: string | null, id: string } | null> | null } | null> | null };

export type RecentCommentsQueryVariables = Exact<{ [key: string]: never; }>;


export type RecentCommentsQuery = { __typename?: 'Query', allComments?: Array<{ __typename?: 'Comment', id: string, _siteCreatedAt: string, _siteValidTime: string, _siteSubject?: string | null, text: string, card?: { __typename?: 'HiringCard', id: string, title: string } | null } | null> | null };

export type CommentsForCardQueryVariables = Exact<{
  id: Scalars['ID'];
  asOf?: InputMaybe<Scalars['String']>;
}>;


export type CommentsForCardQuery = { __typename?: 'Query', commentsForEntity?: Array<{ __typename?: 'Comment', id: string, _siteCreatedAt: string, _siteSubject?: string | null, _siteValidTime: string, text: string, parentId?: string | null, children?: Array<{ __typename?: 'Comment', text: string } | null> | null } | null> | null };

export type CreateHiringCardMutationVariables = Exact<{
  card: HiringCardInput;
  cardId: Scalars['ID'];
  workflowStateId: Scalars['ID'];
  workflowState: WorkflowStateInput;
}>;


export type CreateHiringCardMutation = { __typename?: 'Mutation', updateHiringCard?: { __typename?: 'HiringCard', id: string } | null, updateWorkflowState?: { __typename?: 'WorkflowState', id: string } | null };

export type CreateCommentMutationVariables = Exact<{
  Comment: CommentInput;
}>;


export type CreateCommentMutation = { __typename?: 'Mutation', createComment?: { __typename?: 'Comment', id: string } | null };

export type CreateWorkflowMutationVariables = Exact<{
  name: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  workflowStates: Array<WorkflowStateInput> | WorkflowStateInput;
  workflowStateIds: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type CreateWorkflowMutation = { __typename?: 'Mutation', createWorkflowStates?: Array<{ __typename?: 'WorkflowState', id: string } | null> | null, createWorkflow?: { __typename?: 'Workflow', id: string } | null };

export type CreateWorkflowStateMutationVariables = Exact<{
  colId: Scalars['ID'];
  workflowStateIds: Array<Scalars['ID']> | Scalars['ID'];
  workflowId: Scalars['ID'];
  workflowState: WorkflowStateInput;
}>;


export type CreateWorkflowStateMutation = { __typename?: 'Mutation', updateWorkflowState?: { __typename?: 'WorkflowState', id: string } | null, updateWorkflow?: { __typename?: 'Workflow', id: string } | null };

export type DeleteCommentMutationVariables = Exact<{
  commentId: Scalars['ID'];
}>;


export type DeleteCommentMutation = { __typename?: 'Mutation', deleteComment?: { __typename?: 'Comment', id: string } | null };

export type DeleteWorkflowMutationVariables = Exact<{
  workflowId: Scalars['ID'];
}>;


export type DeleteWorkflowMutation = { __typename?: 'Mutation', deleteWorkflow?: { __typename?: 'Workflow', id: string } | null };

export type DeleteWorkflowStateMutationVariables = Exact<{
  id: Scalars['ID'];
  workflowId: Scalars['ID'];
  workflowStateIds: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type DeleteWorkflowStateMutation = { __typename?: 'Mutation', deleteWorkflowState?: { __typename?: 'WorkflowState', id: string } | null, updateWorkflow?: { __typename?: 'Workflow', id: string } | null };

export type CreateInterviewFeedbackMutationVariables = Exact<{
  interviewFeedback: InterviewFeedbackInput;
}>;


export type CreateInterviewFeedbackMutation = { __typename?: 'Mutation', createInterviewFeedback?: { __typename?: 'InterviewFeedback', id: string } | null };

export type KanbanDataQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type KanbanDataQuery = { __typename?: 'Query', myJuxtcode?: string | null, allWorkflowProjects?: Array<{ __typename?: 'WorkflowProject', id: string, name: string, description?: string | null } | null> | null, workflow?: { __typename?: 'Workflow', description?: string | null, id: string, name: string, workflowStates: Array<{ __typename?: 'WorkflowState', id: string, name: string, description?: string | null, roles?: Array<string | null> | null, tasks?: Array<string | null> | null, cards?: Array<{ __typename?: 'HiringCard', id: string, title: string, _siteValidTime: string, createdAt?: string | null, project?: { __typename?: 'WorkflowProject', id: string, name: string } | null } | null> | null } | null> } | null };

export type WorkflowProjectFieldsFragment = { __typename?: 'WorkflowProject', id: string, name: string, description?: string | null };

export type MoveCardMutationVariables = Exact<{
  workflowStateId: Scalars['ID'];
  cardId: Scalars['ID'];
  previousCard?: InputMaybe<Scalars['ID']>;
}>;


export type MoveCardMutation = { __typename?: 'Mutation', moveCard?: { __typename?: 'HiringCard', id: string } | null };

export type RollbackCardMutationVariables = Exact<{
  asOf: Scalars['String'];
  id: Scalars['ID'];
}>;


export type RollbackCardMutation = { __typename?: 'Mutation', rollbackCard?: { __typename?: 'HiringCard', id: string } | null };

export type UpdateHiringCardMutationVariables = Exact<{
  card: HiringCardInput;
  cardId: Scalars['ID'];
}>;


export type UpdateHiringCardMutation = { __typename?: 'Mutation', updateHiringCard?: { __typename?: 'HiringCard', id: string } | null };

export type UpdateCardPositionMutationVariables = Exact<{
  workflowStateId: Scalars['ID'];
  workflowState: WorkflowStateInput;
}>;


export type UpdateCardPositionMutation = { __typename?: 'Mutation', updateWorkflowState?: { __typename?: 'WorkflowState', id: string } | null };

export type UpdateWorkflowMutationVariables = Exact<{
  id: Scalars['ID'];
  workflowStateIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>> | InputMaybe<Scalars['ID']>>;
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
}>;


export type UpdateWorkflowMutation = { __typename?: 'Mutation', updateWorkflow?: { __typename?: 'Workflow', id: string } | null };

export type UpdateWorkflowProjectMutationVariables = Exact<{
  workflowProject: WorkflowProjectInput;
  workflowProjectId: Scalars['ID'];
}>;


export type UpdateWorkflowProjectMutation = { __typename?: 'Mutation', updateWorkflowProject?: { __typename?: 'WorkflowProject', id: string } | null };

export type UpdateWorkflowStateMutationVariables = Exact<{
  id: Scalars['ID'];
  workflowState: WorkflowStateInput;
}>;


export type UpdateWorkflowStateMutation = { __typename?: 'Mutation', updateWorkflowState?: { __typename?: 'WorkflowState', id: string } | null };

export type CreateWorkflowProjectMutationVariables = Exact<{
  workflowProject: WorkflowProjectInput;
  workflowProjectId: Scalars['ID'];
}>;


export type CreateWorkflowProjectMutation = { __typename?: 'Mutation', createWorkflowProject?: { __typename?: 'WorkflowProject', id: string } | null };

export type WorkflowStateFieldsFragment = { __typename?: 'WorkflowState', id: string, name: string, description?: string | null, roles?: Array<string | null> | null, tasks?: Array<string | null> | null, cards?: Array<{ __typename?: 'HiringCard', id: string, title: string, _siteValidTime: string, createdAt?: string | null, project?: { __typename?: 'WorkflowProject', id: string, name: string } | null } | null> | null };

export const CardDetailsFragmentDoc = `
    fragment CardDetails on Card {
  ... on HiringCard {
    id
    description
    agent
    createdAt
    _siteValidTime
    _siteSubject
    location
    currentOwnerUsernames
    taskHtml
    cvPdf {
      base64
      name
      type
    }
    files {
      base64
      name
      type
    }
    project {
      description
      id
      name
    }
    title
    workflowState {
      id
      name
      tasks
      roles
    }
    stateStr
  }
}
    `;
export const WorkflowProjectFieldsFragmentDoc = `
    fragment WorkflowProjectFields on WorkflowProject {
  id
  name
  description
}
    `;
export const CardFieldsFragmentDoc = `
    fragment CardFields on Card {
  ... on HiringCard {
    id
    title
    _siteValidTime
    createdAt
    project {
      id
      name
    }
  }
}
    `;
export const WorkflowStateFieldsFragmentDoc = `
    fragment WorkflowStateFields on WorkflowState {
  id
  name
  description
  roles
  tasks
  cards {
    ...CardFields
  }
}
    ${CardFieldsFragmentDoc}`;
export const AllProjectsDocument = `
    query allProjects {
  allWorkflowProjects {
    ...WorkflowProjectFields
  }
}
    ${WorkflowProjectFieldsFragmentDoc}`;
export const useAllProjectsQuery = <
      TData = AllProjectsQuery,
      TError = Error
    >(
      variables?: AllProjectsQueryVariables,
      options?: UseQueryOptions<AllProjectsQuery, TError, TData>
    ) =>
    useQuery<AllProjectsQuery, TError, TData>(
      variables === undefined ? ['allProjects'] : ['allProjects', variables],
      fetcher<AllProjectsQuery, AllProjectsQueryVariables>(AllProjectsDocument, variables),
      options
    );
useAllProjectsQuery.document = AllProjectsDocument;


useAllProjectsQuery.getKey = (variables?: AllProjectsQueryVariables) => variables === undefined ? ['allProjects'] : ['allProjects', variables];
;

useAllProjectsQuery.fetcher = (variables?: AllProjectsQueryVariables) => fetcher<AllProjectsQuery, AllProjectsQueryVariables>(AllProjectsDocument, variables);
export const CardHistoryDocument = `
    query cardHistory($id: ID!, $historicalDb: Boolean) {
  cardHistory(id: $id, limit: 100, historicalDb: $historicalDb) {
    ...CardDetails
  }
}
    ${CardDetailsFragmentDoc}`;
export const useCardHistoryQuery = <
      TData = CardHistoryQuery,
      TError = Error
    >(
      variables: CardHistoryQueryVariables,
      options?: UseQueryOptions<CardHistoryQuery, TError, TData>
    ) =>
    useQuery<CardHistoryQuery, TError, TData>(
      ['cardHistory', variables],
      fetcher<CardHistoryQuery, CardHistoryQueryVariables>(CardHistoryDocument, variables),
      options
    );
useCardHistoryQuery.document = CardHistoryDocument;


useCardHistoryQuery.getKey = (variables: CardHistoryQueryVariables) => ['cardHistory', variables];
;

useCardHistoryQuery.fetcher = (variables: CardHistoryQueryVariables) => fetcher<CardHistoryQuery, CardHistoryQueryVariables>(CardHistoryDocument, variables);
export const CardByIdsDocument = `
    query cardByIds($ids: [ID]!) {
  cardsByIds(ids: $ids) {
    ...CardDetails
  }
}
    ${CardDetailsFragmentDoc}`;
export const useCardByIdsQuery = <
      TData = CardByIdsQuery,
      TError = Error
    >(
      variables: CardByIdsQueryVariables,
      options?: UseQueryOptions<CardByIdsQuery, TError, TData>
    ) =>
    useQuery<CardByIdsQuery, TError, TData>(
      ['cardByIds', variables],
      fetcher<CardByIdsQuery, CardByIdsQueryVariables>(CardByIdsDocument, variables),
      options
    );
useCardByIdsQuery.document = CardByIdsDocument;


useCardByIdsQuery.getKey = (variables: CardByIdsQueryVariables) => ['cardByIds', variables];
;

useCardByIdsQuery.fetcher = (variables: CardByIdsQueryVariables) => fetcher<CardByIdsQuery, CardByIdsQueryVariables>(CardByIdsDocument, variables);
export const CommentsForEidDocument = `
    query commentsForEID($id: ID!) {
  commentsForEntity(id: $id) {
    id
    text
    _siteSubject
    _siteValidTime
    _siteCreatedAt
    children {
      _siteSubject
      id
    }
  }
}
    `;
export const useCommentsForEidQuery = <
      TData = CommentsForEidQuery,
      TError = Error
    >(
      variables: CommentsForEidQueryVariables,
      options?: UseQueryOptions<CommentsForEidQuery, TError, TData>
    ) =>
    useQuery<CommentsForEidQuery, TError, TData>(
      ['commentsForEID', variables],
      fetcher<CommentsForEidQuery, CommentsForEidQueryVariables>(CommentsForEidDocument, variables),
      options
    );
useCommentsForEidQuery.document = CommentsForEidDocument;


useCommentsForEidQuery.getKey = (variables: CommentsForEidQueryVariables) => ['commentsForEID', variables];
;

useCommentsForEidQuery.fetcher = (variables: CommentsForEidQueryVariables) => fetcher<CommentsForEidQuery, CommentsForEidQueryVariables>(CommentsForEidDocument, variables);
export const RecentCommentsDocument = `
    query recentComments {
  allComments(limit: 5) {
    id
    card {
      ... on HiringCard {
        id
        title
      }
    }
    _siteCreatedAt
    _siteValidTime
    _siteSubject
    text
  }
}
    `;
export const useRecentCommentsQuery = <
      TData = RecentCommentsQuery,
      TError = Error
    >(
      variables?: RecentCommentsQueryVariables,
      options?: UseQueryOptions<RecentCommentsQuery, TError, TData>
    ) =>
    useQuery<RecentCommentsQuery, TError, TData>(
      variables === undefined ? ['recentComments'] : ['recentComments', variables],
      fetcher<RecentCommentsQuery, RecentCommentsQueryVariables>(RecentCommentsDocument, variables),
      options
    );
useRecentCommentsQuery.document = RecentCommentsDocument;


useRecentCommentsQuery.getKey = (variables?: RecentCommentsQueryVariables) => variables === undefined ? ['recentComments'] : ['recentComments', variables];
;

useRecentCommentsQuery.fetcher = (variables?: RecentCommentsQueryVariables) => fetcher<RecentCommentsQuery, RecentCommentsQueryVariables>(RecentCommentsDocument, variables);
export const CommentsForCardDocument = `
    query commentsForCard($id: ID!, $asOf: String) {
  commentsForEntity(id: $id, limit: 100, order: "asc", asOf: $asOf) {
    id
    _siteCreatedAt
    _siteSubject
    _siteValidTime
    text
    parentId
    children {
      text
    }
  }
}
    `;
export const useCommentsForCardQuery = <
      TData = CommentsForCardQuery,
      TError = Error
    >(
      variables: CommentsForCardQueryVariables,
      options?: UseQueryOptions<CommentsForCardQuery, TError, TData>
    ) =>
    useQuery<CommentsForCardQuery, TError, TData>(
      ['commentsForCard', variables],
      fetcher<CommentsForCardQuery, CommentsForCardQueryVariables>(CommentsForCardDocument, variables),
      options
    );
useCommentsForCardQuery.document = CommentsForCardDocument;


useCommentsForCardQuery.getKey = (variables: CommentsForCardQueryVariables) => ['commentsForCard', variables];
;

useCommentsForCardQuery.fetcher = (variables: CommentsForCardQueryVariables) => fetcher<CommentsForCardQuery, CommentsForCardQueryVariables>(CommentsForCardDocument, variables);
export const CreateHiringCardDocument = `
    mutation createHiringCard($card: HiringCardInput!, $cardId: ID!, $workflowStateId: ID!, $workflowState: WorkflowStateInput!) {
  updateHiringCard(id: $cardId, Card: $card) {
    id
  }
  updateWorkflowState(id: $workflowStateId, workflowState: $workflowState) {
    id
  }
}
    `;
export const useCreateHiringCardMutation = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<CreateHiringCardMutation, TError, CreateHiringCardMutationVariables, TContext>) =>
    useMutation<CreateHiringCardMutation, TError, CreateHiringCardMutationVariables, TContext>(
      ['createHiringCard'],
      (variables?: CreateHiringCardMutationVariables) => fetcher<CreateHiringCardMutation, CreateHiringCardMutationVariables>(CreateHiringCardDocument, variables)(),
      options
    );
useCreateHiringCardMutation.fetcher = (variables: CreateHiringCardMutationVariables) => fetcher<CreateHiringCardMutation, CreateHiringCardMutationVariables>(CreateHiringCardDocument, variables);
export const CreateCommentDocument = `
    mutation createComment($Comment: CommentInput!) {
  createComment(Comment: $Comment) {
    id
  }
}
    `;
export const useCreateCommentMutation = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<CreateCommentMutation, TError, CreateCommentMutationVariables, TContext>) =>
    useMutation<CreateCommentMutation, TError, CreateCommentMutationVariables, TContext>(
      ['createComment'],
      (variables?: CreateCommentMutationVariables) => fetcher<CreateCommentMutation, CreateCommentMutationVariables>(CreateCommentDocument, variables)(),
      options
    );
useCreateCommentMutation.fetcher = (variables: CreateCommentMutationVariables) => fetcher<CreateCommentMutation, CreateCommentMutationVariables>(CreateCommentDocument, variables);
export const CreateWorkflowDocument = `
    mutation createWorkflow($name: String!, $description: String, $workflowStates: [WorkflowStateInput!]!, $workflowStateIds: [ID!]!) {
  createWorkflowStates(workflowStates: $workflowStates) {
    id
  }
  createWorkflow(
    name: $name
    description: $description
    workflowStateIds: $workflowStateIds
  ) {
    id
  }
}
    `;
export const useCreateWorkflowMutation = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<CreateWorkflowMutation, TError, CreateWorkflowMutationVariables, TContext>) =>
    useMutation<CreateWorkflowMutation, TError, CreateWorkflowMutationVariables, TContext>(
      ['createWorkflow'],
      (variables?: CreateWorkflowMutationVariables) => fetcher<CreateWorkflowMutation, CreateWorkflowMutationVariables>(CreateWorkflowDocument, variables)(),
      options
    );
useCreateWorkflowMutation.fetcher = (variables: CreateWorkflowMutationVariables) => fetcher<CreateWorkflowMutation, CreateWorkflowMutationVariables>(CreateWorkflowDocument, variables);
export const CreateWorkflowStateDocument = `
    mutation createWorkflowState($colId: ID!, $workflowStateIds: [ID!]!, $workflowId: ID!, $workflowState: WorkflowStateInput!) {
  updateWorkflowState(id: $colId, workflowState: $workflowState) {
    id
  }
  updateWorkflow(id: $workflowId, workflowStateIds: $workflowStateIds) {
    id
  }
}
    `;
export const useCreateWorkflowStateMutation = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<CreateWorkflowStateMutation, TError, CreateWorkflowStateMutationVariables, TContext>) =>
    useMutation<CreateWorkflowStateMutation, TError, CreateWorkflowStateMutationVariables, TContext>(
      ['createWorkflowState'],
      (variables?: CreateWorkflowStateMutationVariables) => fetcher<CreateWorkflowStateMutation, CreateWorkflowStateMutationVariables>(CreateWorkflowStateDocument, variables)(),
      options
    );
useCreateWorkflowStateMutation.fetcher = (variables: CreateWorkflowStateMutationVariables) => fetcher<CreateWorkflowStateMutation, CreateWorkflowStateMutationVariables>(CreateWorkflowStateDocument, variables);
export const DeleteCommentDocument = `
    mutation deleteComment($commentId: ID!) {
  deleteComment(id: $commentId) {
    id
  }
}
    `;
export const useDeleteCommentMutation = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteCommentMutation, TError, DeleteCommentMutationVariables, TContext>) =>
    useMutation<DeleteCommentMutation, TError, DeleteCommentMutationVariables, TContext>(
      ['deleteComment'],
      (variables?: DeleteCommentMutationVariables) => fetcher<DeleteCommentMutation, DeleteCommentMutationVariables>(DeleteCommentDocument, variables)(),
      options
    );
useDeleteCommentMutation.fetcher = (variables: DeleteCommentMutationVariables) => fetcher<DeleteCommentMutation, DeleteCommentMutationVariables>(DeleteCommentDocument, variables);
export const DeleteWorkflowDocument = `
    mutation deleteWorkflow($workflowId: ID!) {
  deleteWorkflow(id: $workflowId) {
    id
  }
}
    `;
export const useDeleteWorkflowMutation = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteWorkflowMutation, TError, DeleteWorkflowMutationVariables, TContext>) =>
    useMutation<DeleteWorkflowMutation, TError, DeleteWorkflowMutationVariables, TContext>(
      ['deleteWorkflow'],
      (variables?: DeleteWorkflowMutationVariables) => fetcher<DeleteWorkflowMutation, DeleteWorkflowMutationVariables>(DeleteWorkflowDocument, variables)(),
      options
    );
useDeleteWorkflowMutation.fetcher = (variables: DeleteWorkflowMutationVariables) => fetcher<DeleteWorkflowMutation, DeleteWorkflowMutationVariables>(DeleteWorkflowDocument, variables);
export const DeleteWorkflowStateDocument = `
    mutation deleteWorkflowState($id: ID!, $workflowId: ID!, $workflowStateIds: [ID!]!) {
  deleteWorkflowState(id: $id) {
    id
  }
  updateWorkflow(id: $workflowId, workflowStateIds: $workflowStateIds) {
    id
  }
}
    `;
export const useDeleteWorkflowStateMutation = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteWorkflowStateMutation, TError, DeleteWorkflowStateMutationVariables, TContext>) =>
    useMutation<DeleteWorkflowStateMutation, TError, DeleteWorkflowStateMutationVariables, TContext>(
      ['deleteWorkflowState'],
      (variables?: DeleteWorkflowStateMutationVariables) => fetcher<DeleteWorkflowStateMutation, DeleteWorkflowStateMutationVariables>(DeleteWorkflowStateDocument, variables)(),
      options
    );
useDeleteWorkflowStateMutation.fetcher = (variables: DeleteWorkflowStateMutationVariables) => fetcher<DeleteWorkflowStateMutation, DeleteWorkflowStateMutationVariables>(DeleteWorkflowStateDocument, variables);
export const CreateInterviewFeedbackDocument = `
    mutation createInterviewFeedback($interviewFeedback: InterviewFeedbackInput!) {
  createInterviewFeedback(interviewFeedback: $interviewFeedback) {
    id
  }
}
    `;
export const useCreateInterviewFeedbackMutation = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<CreateInterviewFeedbackMutation, TError, CreateInterviewFeedbackMutationVariables, TContext>) =>
    useMutation<CreateInterviewFeedbackMutation, TError, CreateInterviewFeedbackMutationVariables, TContext>(
      ['createInterviewFeedback'],
      (variables?: CreateInterviewFeedbackMutationVariables) => fetcher<CreateInterviewFeedbackMutation, CreateInterviewFeedbackMutationVariables>(CreateInterviewFeedbackDocument, variables)(),
      options
    );
useCreateInterviewFeedbackMutation.fetcher = (variables: CreateInterviewFeedbackMutationVariables) => fetcher<CreateInterviewFeedbackMutation, CreateInterviewFeedbackMutationVariables>(CreateInterviewFeedbackDocument, variables);
export const KanbanDataDocument = `
    query kanbanData($id: ID!) {
  allWorkflowProjects {
    ...WorkflowProjectFields
  }
  myJuxtcode
  workflow(id: $id) {
    description
    id
    name
    workflowStates {
      ...WorkflowStateFields
    }
  }
}
    ${WorkflowProjectFieldsFragmentDoc}
${WorkflowStateFieldsFragmentDoc}`;
export const useKanbanDataQuery = <
      TData = KanbanDataQuery,
      TError = Error
    >(
      variables: KanbanDataQueryVariables,
      options?: UseQueryOptions<KanbanDataQuery, TError, TData>
    ) =>
    useQuery<KanbanDataQuery, TError, TData>(
      ['kanbanData', variables],
      fetcher<KanbanDataQuery, KanbanDataQueryVariables>(KanbanDataDocument, variables),
      options
    );
useKanbanDataQuery.document = KanbanDataDocument;


useKanbanDataQuery.getKey = (variables: KanbanDataQueryVariables) => ['kanbanData', variables];
;

useKanbanDataQuery.fetcher = (variables: KanbanDataQueryVariables) => fetcher<KanbanDataQuery, KanbanDataQueryVariables>(KanbanDataDocument, variables);
export const MoveCardDocument = `
    mutation moveCard($workflowStateId: ID!, $cardId: ID!, $previousCard: ID) {
  moveCard(
    cardId: $cardId
    workflowStateId: $workflowStateId
    previousCard: $previousCard
  ) {
    ... on HiringCard {
      id
    }
  }
}
    `;
export const useMoveCardMutation = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<MoveCardMutation, TError, MoveCardMutationVariables, TContext>) =>
    useMutation<MoveCardMutation, TError, MoveCardMutationVariables, TContext>(
      ['moveCard'],
      (variables?: MoveCardMutationVariables) => fetcher<MoveCardMutation, MoveCardMutationVariables>(MoveCardDocument, variables)(),
      options
    );
useMoveCardMutation.fetcher = (variables: MoveCardMutationVariables) => fetcher<MoveCardMutation, MoveCardMutationVariables>(MoveCardDocument, variables);
export const RollbackCardDocument = `
    mutation rollbackCard($asOf: String!, $id: ID!) {
  rollbackCard(asOf: $asOf, id: $id) {
    ... on HiringCard {
      id
    }
  }
}
    `;
export const useRollbackCardMutation = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<RollbackCardMutation, TError, RollbackCardMutationVariables, TContext>) =>
    useMutation<RollbackCardMutation, TError, RollbackCardMutationVariables, TContext>(
      ['rollbackCard'],
      (variables?: RollbackCardMutationVariables) => fetcher<RollbackCardMutation, RollbackCardMutationVariables>(RollbackCardDocument, variables)(),
      options
    );
useRollbackCardMutation.fetcher = (variables: RollbackCardMutationVariables) => fetcher<RollbackCardMutation, RollbackCardMutationVariables>(RollbackCardDocument, variables);
export const UpdateHiringCardDocument = `
    mutation updateHiringCard($card: HiringCardInput!, $cardId: ID!) {
  updateHiringCard(id: $cardId, Card: $card) {
    id
  }
}
    `;
export const useUpdateHiringCardMutation = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateHiringCardMutation, TError, UpdateHiringCardMutationVariables, TContext>) =>
    useMutation<UpdateHiringCardMutation, TError, UpdateHiringCardMutationVariables, TContext>(
      ['updateHiringCard'],
      (variables?: UpdateHiringCardMutationVariables) => fetcher<UpdateHiringCardMutation, UpdateHiringCardMutationVariables>(UpdateHiringCardDocument, variables)(),
      options
    );
useUpdateHiringCardMutation.fetcher = (variables: UpdateHiringCardMutationVariables) => fetcher<UpdateHiringCardMutation, UpdateHiringCardMutationVariables>(UpdateHiringCardDocument, variables);
export const UpdateCardPositionDocument = `
    mutation updateCardPosition($workflowStateId: ID!, $workflowState: WorkflowStateInput!) {
  updateWorkflowState(id: $workflowStateId, workflowState: $workflowState) {
    id
  }
}
    `;
export const useUpdateCardPositionMutation = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateCardPositionMutation, TError, UpdateCardPositionMutationVariables, TContext>) =>
    useMutation<UpdateCardPositionMutation, TError, UpdateCardPositionMutationVariables, TContext>(
      ['updateCardPosition'],
      (variables?: UpdateCardPositionMutationVariables) => fetcher<UpdateCardPositionMutation, UpdateCardPositionMutationVariables>(UpdateCardPositionDocument, variables)(),
      options
    );
useUpdateCardPositionMutation.fetcher = (variables: UpdateCardPositionMutationVariables) => fetcher<UpdateCardPositionMutation, UpdateCardPositionMutationVariables>(UpdateCardPositionDocument, variables);
export const UpdateWorkflowDocument = `
    mutation updateWorkflow($id: ID!, $workflowStateIds: [ID], $description: String, $name: String) {
  updateWorkflow(
    id: $id
    description: $description
    workflowStateIds: $workflowStateIds
    name: $name
  ) {
    id
  }
}
    `;
export const useUpdateWorkflowMutation = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateWorkflowMutation, TError, UpdateWorkflowMutationVariables, TContext>) =>
    useMutation<UpdateWorkflowMutation, TError, UpdateWorkflowMutationVariables, TContext>(
      ['updateWorkflow'],
      (variables?: UpdateWorkflowMutationVariables) => fetcher<UpdateWorkflowMutation, UpdateWorkflowMutationVariables>(UpdateWorkflowDocument, variables)(),
      options
    );
useUpdateWorkflowMutation.fetcher = (variables: UpdateWorkflowMutationVariables) => fetcher<UpdateWorkflowMutation, UpdateWorkflowMutationVariables>(UpdateWorkflowDocument, variables);
export const UpdateWorkflowProjectDocument = `
    mutation updateWorkflowProject($workflowProject: WorkflowProjectInput!, $workflowProjectId: ID!) {
  updateWorkflowProject(id: $workflowProjectId, workflowProject: $workflowProject) {
    id
  }
}
    `;
export const useUpdateWorkflowProjectMutation = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateWorkflowProjectMutation, TError, UpdateWorkflowProjectMutationVariables, TContext>) =>
    useMutation<UpdateWorkflowProjectMutation, TError, UpdateWorkflowProjectMutationVariables, TContext>(
      ['updateWorkflowProject'],
      (variables?: UpdateWorkflowProjectMutationVariables) => fetcher<UpdateWorkflowProjectMutation, UpdateWorkflowProjectMutationVariables>(UpdateWorkflowProjectDocument, variables)(),
      options
    );
useUpdateWorkflowProjectMutation.fetcher = (variables: UpdateWorkflowProjectMutationVariables) => fetcher<UpdateWorkflowProjectMutation, UpdateWorkflowProjectMutationVariables>(UpdateWorkflowProjectDocument, variables);
export const UpdateWorkflowStateDocument = `
    mutation updateWorkflowState($id: ID!, $workflowState: WorkflowStateInput!) {
  updateWorkflowState(id: $id, workflowState: $workflowState) {
    id
  }
}
    `;
export const useUpdateWorkflowStateMutation = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateWorkflowStateMutation, TError, UpdateWorkflowStateMutationVariables, TContext>) =>
    useMutation<UpdateWorkflowStateMutation, TError, UpdateWorkflowStateMutationVariables, TContext>(
      ['updateWorkflowState'],
      (variables?: UpdateWorkflowStateMutationVariables) => fetcher<UpdateWorkflowStateMutation, UpdateWorkflowStateMutationVariables>(UpdateWorkflowStateDocument, variables)(),
      options
    );
useUpdateWorkflowStateMutation.fetcher = (variables: UpdateWorkflowStateMutationVariables) => fetcher<UpdateWorkflowStateMutation, UpdateWorkflowStateMutationVariables>(UpdateWorkflowStateDocument, variables);
export const CreateWorkflowProjectDocument = `
    mutation createWorkflowProject($workflowProject: WorkflowProjectInput!, $workflowProjectId: ID!) {
  createWorkflowProject(workflowProject: $workflowProject) {
    id
  }
}
    `;
export const useCreateWorkflowProjectMutation = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<CreateWorkflowProjectMutation, TError, CreateWorkflowProjectMutationVariables, TContext>) =>
    useMutation<CreateWorkflowProjectMutation, TError, CreateWorkflowProjectMutationVariables, TContext>(
      ['createWorkflowProject'],
      (variables?: CreateWorkflowProjectMutationVariables) => fetcher<CreateWorkflowProjectMutation, CreateWorkflowProjectMutationVariables>(CreateWorkflowProjectDocument, variables)(),
      options
    );
useCreateWorkflowProjectMutation.fetcher = (variables: CreateWorkflowProjectMutationVariables) => fetcher<CreateWorkflowProjectMutation, CreateWorkflowProjectMutationVariables>(CreateWorkflowProjectDocument, variables);