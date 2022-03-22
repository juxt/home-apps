import {
  UpsertReviewMutationVariables,
  useReviewByIdQuery,
  useUpsertReviewMutation,
  useUser,
} from '@juxt-home/site';
import { notEmpty } from '@juxt-home/utils';
import { useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from 'react-query';
import { api_key, client } from '../common';
import { TMDBError } from '../components/Errors';
import { useReviews } from '../hooks';
import { TMovie } from '../types';

async function fetchMovieById(id: string) {
  const response = await client.get<TMovie>(
    `/3/movie/${id}?api_key=${api_key}&language=en-US`,
  );
  return response.data;
}

function useMovieById(id = '') {
  return useQuery<TMovie, Error>(['movie', id], () => fetchMovieById(id), {
    enabled: !!id,
  });
}

export function Movie({ itemId }: { itemId: string }) {
  const movieResponse = useMovieById(itemId);
  const { data: movieData } = movieResponse;
  const imdb_id = movieData?.imdb_id;

  const reviewResponse = useReviews(imdb_id);

  const queryClient = useQueryClient();

  const { mutate } = useUpsertReviewMutation({
    onSuccess: () => {
      if (imdb_id) {
        queryClient.refetchQueries(useReviewByIdQuery.getKey({ imdb_id }));
      }
    },
  });

  const { register, handleSubmit, reset } =
    useForm<UpsertReviewMutationVariables>();

  const { id: username } = useUser();
  // const formHooks = useForm<UpsertReviewMutationVariables>();

  const onSubmit = async (values: UpsertReviewMutationVariables) => {
    if (imdb_id) {
      console.log('submit', values);
      reset();
      mutate({
        TVFilmReview: {
          ...values.TVFilmReview,
          imdb_id,
          id: `user:${username},imdb_id:${imdb_id}`,
        },
      });
    }
  };
  // console.log('errors', errors);

  return (
    <div>
      <h1>Movie page</h1>
      {movieResponse.isLoading && <p>loading...</p>}
      {movieResponse.isError && <TMDBError error={movieResponse.error} />}
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
      {reviewResponse.isLoading && <p>loading reviews...</p>}
      {reviewResponse.isError && <p>error: {reviewResponse.error.message}</p>}
      {reviewResponse.data && (
        <div>
          <h2>Reviews</h2>
          {reviewResponse.data.tvFilmReviewsById
            ?.filter(notEmpty)
            .map((review) => (
              <div key={review.id}>
                <strong>Review by {review._siteSubject || 'admin'}</strong>
                {review.reviewHTML && <p>{review.reviewHTML}</p>}
                <p>{review.score}</p>
              </div>
            ))}
        </div>
      )}
      {/* form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="score">Score (out of 10):</label>
        <input
          type="number"
          {...register('TVFilmReview.score')}
          id="score"
          min="1"
          max="10"
        />
        <br />
        <label htmlFor="reviewHTML">Review:</label>
        <textarea
          {...register('TVFilmReview.reviewHTML')}
          id="review"
          placeholder="Write your review here..."
        />
        <br />
        <input type="submit" value="Submit Review" />
      </form>
    </div>
  );
}

// {
// min: {
//   value: 1,
//   message: 'Your rating must be between 1 and 10.',
// },
// max: {
//   value: 10,
//   message: 'Your rating must be between 1 and 10.',
// },
// required: {
//   value: true,
//   message: 'This field is required',
// },
// })}

{
  /* <form onSubmit={handleSubmit(onSubmit)}>
  <label htmlFor="review">Review</label>
  <textarea
    {...register('TVFilmReview.reviewHTML', { required: true })}
    id="review"
    placeholder="Write you review..."
  />
  {errors.TVFilmReview?.reviewHTML && <p>This field is required.</p>}

  <br />
  <label htmlFor="score">Rating</label>
  <input
    type="number"
    id="score"
    min="1"
    max="10"
    {...register('TVFilmReview.score')}
  />
  {errors.TVFilmReview?.score && <p>{errors.TVFilmReview.score?.message}</p>}

  <br />
  <input type="submit" />
</form>; */
}
