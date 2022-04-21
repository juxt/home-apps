import { useAllPhotosQuery } from '../generated/graphql';
import { CloudinaryImage } from './Cloudinary';
import { notEmpty } from '@juxt-home/utils';

export function Gallery() {
  const { data } = useAllPhotosQuery();

  return (
    <div className="flex flex-wrap">
      {data?.allPhotos?.filter(notEmpty).map(({ publicId, imageUrl }) => (
        <>
          {publicId && (
            <div className="flex" key={imageUrl}>
              <CloudinaryImage publicId={publicId} />
            </div>
          )}
        </>
      ))}
    </div>
  );
}
