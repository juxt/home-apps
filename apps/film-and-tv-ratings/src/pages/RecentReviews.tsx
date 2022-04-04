import {
  useAllReviewsQuery,
  useDeleteReviewMutation,
  useUser,
} from '@juxt-home/site';
import { groupBy, notEmpty } from '@juxt-home/utils';
import { useQuery, useQueryClient } from 'react-query';
import { api_key, client } from '../common';
import { ReviewCard } from '../components/Card';
import { TMDBError } from '../components/Errors';
import { TMDBItemResponse, TMovie, TReview, TTVShow } from '../types';
import { Title, Text } from '@mantine/core';

type ItemDetails = Partial<TMovie & TTVShow>;

async function fetchItemById(id: string, type: string) {
  const response = await client.get<ItemDetails>(
    `/3/${type}/${id}?api_key=${api_key}&language=en-GB`,
  );
  return response.data;
}

function useItemById(id = '', type: string) {
  return useQuery<ItemDetails, Error>(
    ['finditem', id],
    () => fetchItemById(id, type),
    {
      enabled: !!id,
    },
  );
}

function Review({ reviews }: { id: string; reviews: Array<TReview | null> }) {
  const review = reviews[0];
  const itemInfo = useItemById(review?.tmdb_id, review?.type || 'movie');

  const queryClient = useQueryClient();
  const { mutate } = useDeleteReviewMutation({
    onSuccess: () => {
      queryClient.refetchQueries(useAllReviewsQuery.getKey());
    },
  });

  const handleDelete = async (id: string) => {
    mutate({
      id,
    });
  };

  const result = itemInfo.data;
  const { id: username } = useUser();
  const devMode = true;

  return (
    <div>
      {result && (
        <>
          <Title
            order={2}
            sx={(theme) => ({
              marginTop: 20,
            })}>
            {result?.title || result.name}
          </Title>
          {result?.overview && (
            <Text
              sx={(theme) => ({
                margin: '10px 0',
              })}>
              {result.overview}
            </Text>
          )}
          <Title
            order={4}
            sx={(theme) => ({
              marginBottom: 20,
            })}>
            Reviews:
          </Title>
          <ul>
            {reviews.filter(notEmpty).map((review) => (
              <div key={review.id}>
                <ReviewCard
                  siteSubject={review._siteSubject}
                  reviewHTML={review.reviewHTML}
                  devMode={devMode}
                  score={review.score}
                  username={username}
                  id={review.id}
                  handleDeleteFunction={handleDelete}
                />
              </div>
            ))}
          </ul>
        </>
      )}
      {itemInfo.isLoading && <p>Loading...</p>}
      {itemInfo.isError && <TMDBError error={itemInfo.error} />}
    </div>
  );
}

function useAllReviews() {
  return useAllReviewsQuery(undefined, {
    select: (data) => {
      const reviews = data.allTVFilmReviews?.filter(notEmpty);
      const reviewsById = reviews && groupBy(reviews, (r) => r.tmdb_id);
      return reviewsById;
    },
  });
}

export function RecentReviews() {
  const response = useAllReviews();
  const { data } = response;
  return (
    <div>
      <Title
        order={2}
        sx={(theme) => ({
          marginTop: 15,
        })}>
        Recent Reviews
      </Title>
      <ul>
        {response.isLoading && <p>loading...</p>}
        {response.isError && <p>error: {response.error.message}</p>}
        {data &&
          Object.keys(data).map((id: keyof typeof data) => (
            <Review id={id} reviews={data[id]} key={id} />
          ))}
      </ul>
    </div>
  );
}
