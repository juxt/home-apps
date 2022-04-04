import { useReviewByIdQuery } from '@juxt-home/site';

export function useReviews(tmdb_id?: string, type = 'movie') {
  return useReviewByIdQuery(
    { tmdb_id: `${tmdb_id}-${type}` },
    { enabled: !!tmdb_id },
  );
}
