import { useReviewByIdQuery } from '@juxt-home/site';

export function useReviews(tmdb_id?: string) {
  return useReviewByIdQuery({ tmdb_id: tmdb_id || '' }, { enabled: !!tmdb_id });
}
