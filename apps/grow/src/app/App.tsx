import { useAllProgressQuery } from '@juxt-home/site';
import { TipTapContent } from '@juxt-home/ui-common';
import { notEmpty } from '@juxt-home/utils';
import { Link } from 'react-location';
import './App.css';

export function App() {
  const { data, error, isError, isLoading, isLoadingError } =
    useAllProgressQuery();

  return (
    <div className="mx-10 py-20">
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error: {error?.message}</div>}
      {isLoadingError && <div>Loading error: {error?.message}</div>}
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
