import {
  UpsertReviewMutationVariables,
  useReviewByIdQuery,
  useUpsertReviewMutation,
  useUser,
} from '@juxt-home/site';
import { notEmpty } from '@juxt-home/utils';
import { useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from 'react-query';
import { api_key, client, PosterImage } from '../common';
import { TMDBError } from '../components/Errors';
import { useReviews } from '../hooks';
import { TMovie } from '../types';
import { RichTextEditor } from '@mantine/rte';
import {
  Modal,
  Button,
  Text,
  Title,
  Paper,
  Image,
  Card,
  Textarea,
} from '@mantine/core';
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
  // const [value, onChange] = useState('Write your review here');

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
          <Card
            shadow="sm"
            p="xl"
            sx={(theme) => ({
              backgroundColor: 'lightgray',
            })}>
            <Title order={2}>{movieData.title}</Title>

            <Card.Section
              sx={(theme) => ({
                margin: '10px 0 20px 0',
              })}>
              <PosterImage
                posterPath={movieData.poster_path}
                imageProps={{ width: 420 }}
              />
            </Card.Section>

            <Text size="sm">{movieData.overview}</Text>
          </Card>

          {/* <Title order={2}>{movieData.title}</Title>
          <PosterImage
            posterPath={movieData.poster_path}
            imageProps={{ width: 400 }}
          />
          <Text size="sm">{movieData.overview}</Text> */}
        </div>
      )}
      {reviewResponse.isLoading && <p>loading reviews...</p>}
      {reviewResponse.isError && <p>error: {reviewResponse.error.message}</p>}
      {reviewResponse.data && (
        <div>
          <Title
            order={2}
            sx={(theme) => ({
              margin: '20px 0',
            })}>
            Reviews
          </Title>
          {reviewResponse.data.tvFilmReviewsById
            ?.filter(notEmpty)
            .map((review) => (
              <div key={review.id}>
                <Card
                  shadow="sm"
                  p="xl"
                  sx={(theme) => ({
                    backgroundColor: 'lightgray',
                  })}>
                  <Text
                    weight={700}
                    sx={(theme) => ({
                      margin: '15px 0 10px 0',
                    })}>
                    Review by {review._siteSubject || 'admin'}:
                  </Text>
                  {review.reviewHTML && (
                    <Paper
                      shadow="xs"
                      p="md"
                      sx={(theme) => ({
                        marginBottom: 10,
                      })}>
                      <Text>{review.reviewHTML}</Text>
                    </Paper>
                  )}
                  {/* <RichTextEditor readOnly value={value} onChange={onChange} /> */}
                  <Text>Score: {review.score}</Text>
                </Card>
              </div>
            ))}
        </div>
      )}
      <div>
        <Title
          order={2}
          sx={(theme) => ({
            margin: '20px 0',
          })}>
          New Review
        </Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* <label htmlFor="score">Score (out of 10):</label> */}
          <Text
            weight={500}
            size={'sm'}
            sx={(theme) => ({
              marginBottom: 5,
            })}>
            Score (out of 10):
          </Text>
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
          {/* <Text weight={500}>Review:</Text> */}
          <Textarea
            {...register('TVFilmReview.reviewHTML')}
            id="review"
            placeholder="Write your review here..."
            label="Review:"
            required
            sx={(theme) => ({
              margin: '15px 0 10px 0',
            })}
          />
          {/* <RichTextEditor
            {...register('TVFilmReview.reviewHTML')}
            value={value}
            id="review"
            onChange={onChange}
          /> */}
          <br />
          <Button color="orange" variant="light" type="submit">
            Submit Review
          </Button>
        </form>
      </div>
    </div>
  );
}
