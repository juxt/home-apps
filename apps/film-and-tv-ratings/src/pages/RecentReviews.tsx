import {
  useAllReviewsQuery,
  useDeleteReviewMutation,
  useUser,
} from '@juxt-home/site';
import { groupBy, notEmpty } from '@juxt-home/utils';
import { useQuery, useQueryClient } from 'react-query';
import { api_key, client } from '../common';
import { TMDBError } from '../components/Errors';
import { useReviews } from '../hooks';
import { TMDBItemResponse, TReview } from '../types';

async function fetchItemById(id: string) {
  const response = await client.get<TMDBItemResponse>(
    `/3/find/${id}?api_key=${api_key}&language=en-GB&external_source=imdb_id`,
  );
  return response.data;
}

function useItemById(id = '') {
  return useQuery<TMDBItemResponse, Error>(
    ['finditem', id],
    () => fetchItemById(id),
    {
      enabled: !!id,
    },
  );
}

function Review({ imdb_id, reviews }: { imdb_id: string; reviews: TReview[] }) {
  const itemInfo = useItemById(imdb_id);
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
  const result = itemInfo.data?.movie_results[0];
  const { id: username } = useUser();
  const devMode = true;
  return (
    <div>
      {result && (
        <>
          <h2>{result.title}</h2>
          <p>{result.overview}</p>
          <p>Reviews:</p>
          <ul>
            {reviews.map((review) => (
              <div key={review.id}>
                {(devMode || review._siteSubject === username) && (
                  <button onClick={() => handleDelete(review.id)}>
                    delete
                  </button>
                )}
                <li>{review._siteSubject}</li>
                <li>{review.reviewHTML}</li>
                <li>{review.score}</li>
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
      const reviewsById = reviews && groupBy(reviews, (r) => r.imdb_id);
      return reviewsById;
    },
  });
}

export function RecentReviews() {
  const response = useAllReviews();
  const { data } = response;
  return (
    <div>
      <h1>Recent Reviews</h1>
      <ul>
        {response.isLoading && <p>loading...</p>}
        {response.isError && <p>error: {response.error.message}</p>}
        {data &&
          Object.keys(data).map((id: keyof typeof data) => (
            <Review imdb_id={id} reviews={data[id]} key={id} />
          ))}
      </ul>
    </div>
  );
}
