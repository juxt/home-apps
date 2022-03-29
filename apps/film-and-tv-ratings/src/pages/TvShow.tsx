import {
  useUpsertReviewMutation,
  useReviewByIdQuery,
  useUser,
  UpsertReviewMutationVariables,
} from '@juxt-home/site';
import { Controller, useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from 'react-query';
import { api_key, client, PosterImage } from '../common';
import { useReviews } from '../hooks';
import { AxiosTMDBError, TTVShow } from '../types';
import { toast } from 'react-toastify';
import { TMDBError } from '../components/Errors';
import { Card, Title, Text, Button } from '@mantine/core';
import { ReviewCard } from '../components/Card';
import RichTextEditor from '@mantine/rte';
import { notEmpty } from '@juxt-home/utils';

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

  // tried naming this something else but an <Exact> that was expecting imdb_id gave issues
  // but I think having it with the same name might also be an issue
  const imdb_id = movieData?.id;

  const reviewResponse = useReviews(imdb_id);

  const queryClient = useQueryClient();

  const { mutate } = useUpsertReviewMutation({
    onSuccess: () => {
      if (imdb_id) {
        queryClient.refetchQueries(useReviewByIdQuery.getKey({ imdb_id }));
      }
    },
  });

  const { register, handleSubmit, reset, control } =
    useForm<UpsertReviewMutationVariables>();

  const { id: username } = useUser();

  const onSubmit = async (values: UpsertReviewMutationVariables) => {
    if (!values.TVFilmReview.reviewHTML) {
      toast.error('Please write a review', {
        autoClose: 1000,
      });
    } else if (imdb_id) {
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
            <Title order={2}>{movieData.name}</Title>

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
                  // devMode={devMode}
                  score={review.score}
                  username={username}
                  id={review.id}
                  //handleDeleteFunction={handleDelete}
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
    </div>
  );
}
