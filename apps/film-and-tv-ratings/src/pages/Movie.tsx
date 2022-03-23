import {
  UpsertReviewMutationVariables,
  useReviewByIdQuery,
  useUpsertReviewMutation,
  useUser,
} from '@juxt-home/site';
import { notEmpty } from '@juxt-home/utils';
import { Button, Card, Group, Modal } from '@mantine/core';
import { RichTextEditor } from '@mantine/rte';
import { useState } from 'react';
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
  const [value, onChange] = useState('');
  const [opened, setOpened] = useState(false);

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpsertReviewMutationVariables>();

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

  console.log(value);

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
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Add your review...">
        <Card shadow="sm" p="lg">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card.Section>
              <label htmlFor="score">Score (out of 10):</label>
              <br />
              <input
                type="number"
                {...register('TVFilmReview.score', {
                  min: {
                    value: 1,
                    message: 'Your rating must be between 1 and 10.',
                  },
                  max: {
                    value: 10,
                    message: 'Your rating must be between 1 and 10.',
                  },
                  required: {
                    value: true,
                    message: 'This field is required',
                  },
                })}
                id="score"
              />
            </Card.Section>

            {errors.TVFilmReview?.score && (
              <p>{errors.TVFilmReview.score?.message}</p>
            )}

            <Card.Section>
              <label htmlFor="reviewHTML">Review:</label> <br />
              <RichTextEditor
                id="review"
                placeholder="Write your review here..."
                {...register('TVFilmReview.reviewHTML', {
                  required: {
                    value: true,
                    message: 'This field is required',
                  },
                })}
                onChange={onChange}
                value={value}
              />
              {errors.TVFilmReview?.reviewHTML && (
                <p>{errors.TVFilmReview.reviewHTML.message}</p>
              )}
              {/* <textarea
                {...register('TVFilmReview.reviewHTML')}
                id="review"
                placeholder="Write your review here..."
              /> */}
            </Card.Section>

            <Button
              type="submit"
              variant="gradient"
              gradient={{ from: 'green', to: 'blue', deg: 70 }}>
              Submit
            </Button>

            {/* <input type="submit" value="Submit Review" /> */}
          </form>
        </Card>
      </Modal>

      <Group position="center">
        <Button
          variant="gradient"
          gradient={{ from: 'green', to: 'blue', deg: 70 }}
          onClick={() => setOpened(true)}>
          Add Review
        </Button>
      </Group>
    </div>
  );
}
