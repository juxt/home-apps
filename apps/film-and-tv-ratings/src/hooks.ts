import { useReviewByIdQuery } from '@juxt-home/site';

export function useReviews(tmdb_id_unique?: string, type = 'movie') {
  return useReviewByIdQuery(
    { tmdb_id_unique: `${tmdb_id_unique}` },
    { enabled: !!tmdb_id_unique },
  );
}
