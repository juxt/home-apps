import { useQuery } from 'react-query';
import { api_key } from '../common';
import { TMovie } from '../types';

async function fetchMovieById(id: string) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${api_key}&language=en-US`,
  );
  const data = await response.json();
  return data;
}

function useMovieById(id = '') {
  return useQuery<TMovie, Error>(['movie', id], () => fetchMovieById(id), {
    enabled: !!id,
  });
}

export function Movie({ itemId }: { itemId: string }) {
  const { data, isLoading, error } = useMovieById(itemId);
  return (
    <div>
      <h1>Movie page</h1>
      {isLoading && <p>loading...</p>}
      {error && <p>error: {error.message}</p>}
      {data && (
        <ul>
          <li>
            <p>{data.title}</p>
          </li>
          <li>
            <p>{data.overview}</p>
          </li>
        </ul>
      )}
    </div>
  );
}
