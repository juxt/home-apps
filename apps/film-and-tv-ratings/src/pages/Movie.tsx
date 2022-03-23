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
import { RichTextEditor } from '@mantine/rte';
import { Modal, Button, Text, Title, Paper, Image } from '@mantine/core';
import { useState } from 'react';

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
  // will remove this later, just trying to do a smooth transition
  const [value, onChange] = useState('Write your review here');

  const [opened, setOpened] = useState(false);

  const movieResponse = useMovieById(itemId);
  const { data: movieData } = movieResponse;
  const imdb_id = movieData?.imdb_id;
  // console.log(movieData);

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
  // const onSubmit = (data: any) => console.log(data);

  const { id: username } = useUser();

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

  return (
    <div>
      {/* <Title order={1}>Movie page</Title> */}
      {movieResponse.isLoading && <p>loading...</p>}
      {movieResponse.isError && <TMDBError error={movieResponse.error} />}
      {movieData && (
        <div>
          <Title order={2}>{movieData.title}</Title>
          <Image
            src={`https://image.tmdb.org/t/p/original/${movieData.poster_path}`}
            width={400}
            alt="Movie poster"
          />
          <Text>{movieData.overview}</Text>
        </div>
      )}
      {reviewResponse.isLoading && <p>loading reviews...</p>}
      {reviewResponse.isError && <p>error: {reviewResponse.error.message}</p>}
      {reviewResponse.data && (
        <div>
          <Title order={2}>Reviews</Title>
          {reviewResponse.data.tvFilmReviewsById
            ?.filter(notEmpty)
            .map((review) => (
              <div key={review.id}>
                <Text weight={700}>
                  Review by {review._siteSubject || 'admin'}
                </Text>
                {review.reviewHTML && (
                  <Paper shadow="xs" p="md">
                    <Text>{review.reviewHTML}</Text>
                  </Paper>
                )}
                {/* <RichTextEditor readOnly value={value} onChange={onChange} /> */}
                <Text>Score: {review.score}</Text>
              </div>
            ))}
        </div>
      )}
      <div>
        <Title order={2}>New Review</Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* <label htmlFor="score">Score (out of 10):</label> */}
          <Text weight={500}>Score (out of 10):</Text>
          <input
            {...register('TVFilmReview.score')}
            type="number"
            id="score"
            min="1"
            max="10"
            required
          />
          <br />
          {/* <label htmlFor="reviewHTML">Review:</label> */}
          <Text weight={500}>Review:</Text>
          {/* <textarea
            {...register('TVFilmReview.reviewHTML')}
            id="review"
            placeholder="Write your review here..."
          />
          <br /> */}
          <RichTextEditor
            {...register('TVFilmReview.reviewHTML')}
            value={value}
            id="review"
            onChange={onChange}
          />
          <br />
          <Button color="orange" variant="light" type="submit">Submit Review</Button>
        </form>
      </div>
    </div>
  );
}
