import { useAllPhotosQuery } from '../generated/graphql';
import { CloudinaryImage } from './Cloudinary';
import { notEmpty } from '@juxt-home/utils';

export function Gallery() {
  const { data } = useAllPhotosQuery();

  return (
    <div className="flex flex-wrap">
      {data?.allPhotos?.filter(notEmpty).map(({ publicId }) => (
        <>
          {publicId && (
            <div className="flex" key={publicId}>
              <CloudinaryImage publicId={publicId} />
            </div>
          )}
        </>
      ))}
    </div>
  );
}
