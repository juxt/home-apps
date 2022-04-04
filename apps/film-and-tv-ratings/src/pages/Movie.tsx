import {
  UpsertReviewMutationVariables,
  useDeleteReviewMutation,
  useReviewByIdQuery,
  useUpsertReviewMutation,
  useUser,
} from '@juxt-home/site';
import { notEmpty } from '@juxt-home/utils';
import { Controller, useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from 'react-query';
import { api_key, client, PosterImage } from '../common';
import { ReviewCard, TvFilmCard } from '../components/Card';
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
  ScrollArea,
  Container,
  Group,
  ActionIcon,
  NumberInput,
  NumberInputHandlers,
} from '@mantine/core';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';

async function fetchMovieById(id: string) {
  const response = await client.get<TMovie>(
    `/3/movie/${id}?api_key=${api_key}&language=en-US`,
  );
  return response.data;
}

function useMovieById(id = '') {
  return useQuery<TMovie, Error>(['movie', id], () => fetchMovieById(id), {
    enabled: !!id,
    select: (data) => ({ ...data, id: id.toString() }),
  });
}

export function Movie({ itemId }: { itemId: string }) {
  const movieResponse = useMovieById(itemId);
  const { data: movieData } = movieResponse;
  const tmdb_id = movieData?.id;
  const tmdb_id_unique = `${tmdb_id}-movie`;

  const reviewResponse = useReviews(tmdb_id_unique, 'movie');

  const queryClient = useQueryClient();

  const handlers = useRef<NumberInputHandlers>();

  const refetch = () =>
    queryClient.refetchQueries(useReviewByIdQuery.getKey({ tmdb_id_unique }));

  const { mutate } = useUpsertReviewMutation({
    onSuccess: () => {
      if (tmdb_id) {
        refetch();
      }
    },
  });

  const { mutate: deleteReview } = useDeleteReviewMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleDelete = async (id: string) => {
    deleteReview({
      id,
    });
  };

  const { register, handleSubmit, reset, control } =
    useForm<UpsertReviewMutationVariables>();

  const { id: username } = useUser();

  const onSubmit = async (values: UpsertReviewMutationVariables) => {
    if (!values.TVFilmReview.reviewHTML || !values.TVFilmReview.score) {
      toast.error('Please add a review and a score', {
        autoClose: 1000,
      });
    } else if (tmdb_id) {
      console.log('submit', values);
      reset();
      mutate({
        TVFilmReview: {
          ...values.TVFilmReview,
          tmdb_id,
          type: 'movie',
          id: `user:${username},tmdb_id:${tmdb_id}-movie`,
        },
      });
    }
  };

  return (
    <ScrollArea style={{ height: '100%' }}>
      <Container>
        {movieResponse.isLoading && <p>loading...</p>}
        {movieResponse.isError && <TMDBError error={movieResponse.error} />}
        {movieData && (
          <div>
            <TvFilmCard
              title={movieData.title}
              posterPath={movieData.poster_path}
              overview={movieData.overview}
              badge1={movieData.release_date
                .split('-')
                .filter((e) => {
                  return e.length > 3;
                })
                .join('')}
              badge2={`${movieData.runtime} min`}
              badge3={`IMDb rating: ${movieData.vote_average}`}
            />
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
                  <ReviewCard
                    siteSubject={review._siteSubject}
                    reviewHTML={review.reviewHTML}
                    score={review.score}
                    username={username}
                    id={review.id}
                    handleDeleteFunction={handleDelete}
                  />
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
            <Group>
              <Text
                weight={500}
                size={'sm'}
                sx={(theme) => ({
                  marginBottom: 5,
                })}>
                Score (out of 10):
              </Text>
              <Controller
                control={control}
                name="TVFilmReview.score"
                render={({
                  field: { onChange, onBlur, value, name, ref },
                  fieldState: { invalid, isTouched, isDirty, error },
                  formState,
                }) => (
                  <Group spacing={5}>
                    <ActionIcon
                      size={36}
                      variant="default"
                      onClick={() => handlers.current?.decrement()}>
                      –
                    </ActionIcon>

                    <NumberInput
                      hideControls
                      value={value}
                      onChange={onChange}
                      handlersRef={handlers}
                      max={10}
                      min={1}
                      step={1}
                      placeholder={'?'}
                      styles={{ input: { width: 54, textAlign: 'center' } }}
                    />

                    <ActionIcon
                      size={36}
                      variant="default"
                      onClick={() => handlers.current?.increment()}>
                      +
                    </ActionIcon>
                  </Group>
                )}
              />
            </Group>
            <br />
            <Text
              weight={500}
              size={'sm'}
              sx={(theme) => ({
                marginBottom: 5,
              })}>
              Review:
            </Text>
            <Controller
              control={control}
              name="TVFilmReview.reviewHTML"
              render={({
                field: { onChange, onBlur, value, name, ref },
                fieldState: { invalid, isTouched, isDirty, error },
                formState,
              }) => (
                <RichTextEditor
                  value={value || ''}
                  id="review"
                  onChange={onChange}
                  placeholder={'Write your review here...'}
                />
              )}
            />
            <br />
            <Button color="orange" variant="light" type="submit">
              Submit Review
            </Button>
          </form>
        </div>
      </Container>
    </ScrollArea>
  );
}
