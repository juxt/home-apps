import { notEmpty } from '@juxt-home/utils';
import { useAllPhotosQuery } from './generated/graphql';

export function App() {
  const { data } = useAllPhotosQuery();
  return (
    <div>
      <h1>my photos</h1>
      {data?.allPhotos?.filter(notEmpty).map((photo) => (
        <div key={photo.id}>{photo.title}</div>
      ))}
    </div>
  );
}
