import {
  UpsertReviewMutationVariables,
  useReviewByIdQuery,
  useUpsertReviewMutation,
} from '@juxt-home/site';
import { StandaloneForm } from '@juxt-home/ui-common';
import { useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from 'react-query';
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
  const movieResponse = useMovieById(itemId);
  const { data: movieData } = movieResponse;
  const imdb_id = movieData?.imdb_id || '';

  const reviewResponse = useReviewByIdQuery({ imdb_id });

  const queryClient = useQueryClient();

  const { mutate } = useUpsertReviewMutation({
    onSuccess: (data) => {
      if (imdb_id) {
        queryClient.setQueryData(useReviewByIdQuery.getKey({ imdb_id }), data);
      }
    },
  });

  const formHooks = useForm<UpsertReviewMutationVariables>();

  const handleSubmit = async (values: UpsertReviewMutationVariables) => {
    if (imdb_id) {
      console.log('submit', values);
      formHooks.reset();
      mutate({
        TVFilmReview: {
          ...values.TVFilmReview,
          id: `imdb_id:${imdb_id}`,
        },
      });
    }
  };

  return (
    <div>
      <h1>Movie page</h1>
      {movieResponse.isLoading && <p>loading...</p>}
      {movieResponse.isError && <p>error: {movieResponse.error.message}</p>}
      {movieData && (
        <ul>
          <li>
            <p>{movieData.title}</p>
          </li>
          <li>
            <p>{movieData.overview}</p>
          </li>
        </ul>
      )}
      <StandaloneForm
        formHooks={formHooks}
        handleSubmit={formHooks.handleSubmit(handleSubmit)}
        fields={[
          {
            label: 'Review',
            type: 'tiptap',
            path: 'TVFilmReview.reviewHTML',
          },
          {
            label: 'Rating',
            type: 'number',
            path: 'TVFilmReview.score',
          },
        ]}
      />
    </div>
  );
}
