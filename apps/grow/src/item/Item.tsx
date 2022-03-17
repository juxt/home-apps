import {
  useAllProgressQuery,
  AllProgressQuery,
  CreateProgressMutationVariables,
  useCreateProgressMutation,
} from '@juxt-home/site';
import { Button, StandaloneForm } from '@juxt-home/ui-common';
import { notEmpty } from '@juxt-home/utils';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMatch } from 'react-location';
import { useQueryClient } from 'react-query';

type TProgressItem = NonNullable<
  NonNullable<AllProgressQuery['allProgressItems']>[0]
>;

function ProgressItem({ progressItem }: { progressItem: TProgressItem }) {
  return (
    <div>
      <h1>{progressItem.name}</h1>
      <p>{progressItem.descriptionHTML}</p>
      <p>{progressItem.currentScore}</p>
    </div>
  );
}

function ProgressItemEdit({
  progressItem,
  handleSubmit,
}: {
  progressItem: TProgressItem;
  handleSubmit: (values: CreateProgressMutationVariables) => void;
}) {
  const defaultValues = {
    progressItem,
  };
  const formHooks = useForm<CreateProgressMutationVariables>({
    defaultValues,
  });

  return (
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
  );
}

export default function Item() {
  const { data, error, isError, isLoading, isLoadingError } =
    useAllProgressQuery();

  const {
    params: { item },
  } = useMatch();

  const progressItem = data?.allProgressItems
    ?.filter(notEmpty)
    .find((pItem) => pItem.id === item);

  const [editMode, setEditMode] = useState(false);
  const Progress = editMode ? ProgressItemEdit : ProgressItem;
  const queryClient = useQueryClient();
  const { mutate, error: mutationError } = useCreateProgressMutation({
    onSettled: () => {
      queryClient.refetchQueries('allProgress');
    },
  });
  const handleSubmit = async (values: CreateProgressMutationVariables) => {
    console.log('submit', values);
    setEditMode(false);
    mutate({
      progressItem: values.progressItem,
    });
  };
  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error: {error?.message}</div>}
      {isLoadingError && <div>Loading error: {error?.message}</div>}
      <Button onClick={() => setEditMode(!editMode)}>
        {editMode ? 'Stop Editing' : 'Edit'}
      </Button>

      {progressItem && (
        <Progress handleSubmit={handleSubmit} progressItem={progressItem} />
      )}

      {!isLoading && !isError && !isLoadingError && !progressItem && (
        <div>No progress item found</div>
      )}
    </div>
  );
}
