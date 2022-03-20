import {
  CreateProgressMutationVariables,
  useAllProgressQuery,
  useCreateProgressMutation,
} from '@juxt-home/site';
import { StandaloneForm, TipTapContent, useDirty } from '@juxt-home/ui-common';
import { notEmpty } from '@juxt-home/utils';
import { useForm } from 'react-hook-form';
import { Link } from '@tanstack/react-location';
import { useQueryClient } from 'react-query';
import './App.css';

export function App() {
  const { data, error, isError, isLoading, isLoadingError } =
    useAllProgressQuery();
  const queryClient = useQueryClient();
  const { mutate, error: mutationError } = useCreateProgressMutation({
    onSettled: () => {
      queryClient.refetchQueries('allProgress');
    },
  });
  const defaultValues = {
    progressItem: {
      name: 'hello',
      currentScore: undefined,
    },
  };
  const formHooks = useForm<CreateProgressMutationVariables>({
    defaultValues,
  });

  const handleSubmit = async (
    values: Omit<CreateProgressMutationVariables, 'id'>,
  ) => {
    console.log('submit', values);
    formHooks.reset(defaultValues);
    mutate({
      progressItem: {
        ...values.progressItem,
        id: values.progressItem.name,
      },
    });
  };
  return (
    <div className="mx-10 py-20">
      <StandaloneForm
        fields={[
          {
            name: 'name',
            label: 'Name',
            type: 'text',
            path: 'progressItem.name',
          },
          {
            label: 'Description',
            type: 'tiptap',
            path: 'progressItem.descriptionHTML',
          },
          {
            label: 'Progress',
            type: 'text',
            path: 'progressItem.currentScore',
          },
        ]}
        formHooks={formHooks}
        handleSubmit={formHooks.handleSubmit(handleSubmit)}
      />
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error: {error?.message}</div>}
      {isLoadingError && <div>Loading error: {error?.message}</div>}
      <pre>{JSON.stringify(error)}</pre>
      <pre>{JSON.stringify(mutationError)}</pre>
      {data?.allProgressItems &&
        data.allProgressItems
          .filter(notEmpty)
          .map(({ id, currentScore, name, descriptionHTML }) => (
            <div key={id}>
              <p>Name</p>
              <Link className="underline text-blue-500" to={`/item/${name}`}>
                {name}
              </Link>
              {descriptionHTML && (
                <>
                  <p>Description</p>
                  <TipTapContent htmlString={descriptionHTML} />
                </>
              )}
              <p>Score</p>
              <p>{currentScore}</p>
            </div>
          ))}
    </div>
  );
}
