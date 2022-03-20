import { useReviewByIdQuery } from '@juxt-home/site';

export function useReviews(imdb_id?: string) {
  return useReviewByIdQuery({ imdb_id: imdb_id || '' }, { enabled: !!imdb_id });
}
