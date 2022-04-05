import {
  useUpsertReviewMutation,
  useReviewByIdQuery,
  useUser,
  UpsertReviewMutationVariables,
  useDeleteReviewMutation,
} from '@juxt-home/site';
import { Controller, useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from 'react-query';
import { api_key, client } from '../common';
import { useReviews } from '../hooks';
import { AxiosTMDBError, TTVShow } from '../types';
import { toast } from 'react-toastify';
import { TMDBError } from '../components/Errors';
import {
  Title,
  Text,
  Button,
  ScrollArea,
  Container,
  Group,
  ActionIcon,
  NumberInput,
  NumberInputHandlers,
} from '@mantine/core';
import { ReviewCard, TvFilmCard } from '../components/Card';
import RichTextEditor from '@mantine/rte';
import { notEmpty } from '@juxt-home/utils';
import { useRef } from 'react';

async function fetchTvShowById(id: string) {
  const response = await client.get<TTVShow>(
    `/3/tv/${id}?api_key=${api_key}&language=en-US`,
  );
  return response.data;
}

function useTvById(id = '') {
  return useQuery<TTVShow, AxiosTMDBError>(
    ['movie', id],
    () => fetchTvShowById(id),
    {
      enabled: !!id,
    },
  );
}

export function TvShow({ itemId }: { itemId: string }) {
  const movieResponse = useTvById(itemId);
  const { data: movieData } = movieResponse;

  const handlers = useRef<NumberInputHandlers>();

  const tmdb_id = movieData?.id;
  const tmdb_id_unique = `${tmdb_id}-tv`;

  const reviewResponse = useReviews(tmdb_id_unique, 'tv');

  const queryClient = useQueryClient();
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

  const { handleSubmit, reset, control } =
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
          tmdb_id_unique: `${tmdb_id}-tv`,
          tmdb_id,
          type: 'tv',
          id: `user:${username},tmdb_id:${tmdb_id}-tv`,
        },
      });
    }
  };

  const devMode = true;

  return (
    <ScrollArea style={{ height: '100%' }}>
      <Container>
        {movieResponse.isLoading && <p>loading...</p>}
        {movieResponse.isError && <TMDBError error={movieResponse.error} />}
        {movieData && (
          <div>
            <TvFilmCard
              title={movieData.name}
              posterPath={movieData.poster_path}
              overview={movieData.overview}
              badge1={`${movieData?.first_air_date
                .split('-')
                .filter((e) => {
                  return e.length > 3;
                })
                .join('')}-${
                movieData.last_air_date &&
                movieData.last_air_date
                  .split('-')
                  .filter((e) => {
                    return e.length > 3;
                  })
                  .join('')
              }`}
              badge2={`${movieData.number_of_seasons} seasons`}
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
                    devMode={devMode}
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
