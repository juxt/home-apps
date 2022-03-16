import { useAllProgressQuery } from '@juxt-home/site';
import { notEmpty } from '@juxt-home/utils';
import { useMatch } from 'react-location';

export default function Item() {
  const { data, error, isError, isLoading, isLoadingError } =
    useAllProgressQuery();

  const {
    params: { item },
  } = useMatch();

  const progressItem = data?.allProgressItems
    ?.filter(notEmpty)
    .find((pItem) => pItem.name === item);
  console.log('progressItem', progressItem);

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error: {error?.message}</div>}
      {isLoadingError && <div>Loading error: {error?.message}</div>}
      {progressItem && (
        <div>
          <h1>{progressItem.name}</h1>
          <p>{progressItem.descriptionHTML}</p>
          <p>{progressItem.currentScore}</p>
        </div>
      )}
      {!isLoading && !isError && !isLoadingError && !progressItem && (
        <div>No progress item found</div>
      )}
    </div>
  );
}
