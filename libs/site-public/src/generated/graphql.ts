import { useQuery, UseQueryOptions } from 'react-query';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables>(query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch("http://localhost:5509/public/graphql", {
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

export type GrowResource = {
  __typename?: 'GrowResource';
  _siteSubject?: Maybe<Scalars['String']>;
  _siteValidTime: Scalars['String'];
  category?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  descriptionHTML?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  tags?: Maybe<Array<Maybe<GrowTag>>>;
  url?: Maybe<Scalars['String']>;
};

export type GrowTag = {
  __typename?: 'GrowTag';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  allGrowResources?: Maybe<Array<Maybe<GrowResource>>>;
  allGrowTags?: Maybe<Array<Maybe<GrowTag>>>;
};

export type AllGrowResourcesQueryVariables = Exact<{ [key: string]: never; }>;


export type AllGrowResourcesQuery = { __typename?: 'Query', allGrowResources?: Array<{ __typename?: 'GrowResource', category?: string | null, description?: string | null, descriptionHTML?: string | null, _siteSubject?: string | null, _siteValidTime: string, id: string, name: string, url?: string | null, tags?: Array<{ __typename?: 'GrowTag', name: string, id: string } | null> | null } | null> | null };

export type AllGrowTagsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllGrowTagsQuery = { __typename?: 'Query', allGrowTags?: Array<{ __typename?: 'GrowTag', id: string, name: string } | null> | null };


export const AllGrowResourcesDocument = `
    query allGrowResources {
  allGrowResources {
    category
    description
    descriptionHTML
    _siteSubject
    _siteValidTime
    id
    name
    tags {
      name
      id
    }
    url
  }
}
    `;
export const useAllGrowResourcesQuery = <
      TData = AllGrowResourcesQuery,
      TError = Error
    >(
      variables?: AllGrowResourcesQueryVariables,
      options?: UseQueryOptions<AllGrowResourcesQuery, TError, TData>
    ) =>
    useQuery<AllGrowResourcesQuery, TError, TData>(
      variables === undefined ? ['allGrowResources'] : ['allGrowResources', variables],
      fetcher<AllGrowResourcesQuery, AllGrowResourcesQueryVariables>(AllGrowResourcesDocument, variables),
      options
    );
useAllGrowResourcesQuery.document = AllGrowResourcesDocument;


useAllGrowResourcesQuery.getKey = (variables?: AllGrowResourcesQueryVariables) => variables === undefined ? ['allGrowResources'] : ['allGrowResources', variables];
;

useAllGrowResourcesQuery.fetcher = (variables?: AllGrowResourcesQueryVariables) => fetcher<AllGrowResourcesQuery, AllGrowResourcesQueryVariables>(AllGrowResourcesDocument, variables);
export const AllGrowTagsDocument = `
    query allGrowTags {
  allGrowTags {
    id
    name
  }
}
    `;
export const useAllGrowTagsQuery = <
      TData = AllGrowTagsQuery,
      TError = Error
    >(
      variables?: AllGrowTagsQueryVariables,
      options?: UseQueryOptions<AllGrowTagsQuery, TError, TData>
    ) =>
    useQuery<AllGrowTagsQuery, TError, TData>(
      variables === undefined ? ['allGrowTags'] : ['allGrowTags', variables],
      fetcher<AllGrowTagsQuery, AllGrowTagsQueryVariables>(AllGrowTagsDocument, variables),
      options
    );
useAllGrowTagsQuery.document = AllGrowTagsDocument;


useAllGrowTagsQuery.getKey = (variables?: AllGrowTagsQueryVariables) => variables === undefined ? ['allGrowTags'] : ['allGrowTags', variables];
;

useAllGrowTagsQuery.fetcher = (variables?: AllGrowTagsQueryVariables) => fetcher<AllGrowTagsQuery, AllGrowTagsQueryVariables>(AllGrowTagsDocument, variables);