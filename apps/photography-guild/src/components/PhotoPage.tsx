import {
  GlassMagnifier,
  Magnifier,
  MOUSE_ACTIVATION,
  TOUCH_ACTIVATION,
} from 'react-image-magnifiers';
import { cloudName } from '../constants';
import { useAllPhotosQuery } from '../generated/graphql';
import { ExifType } from './types';

export function PhotoPage({ id }: { id?: string }) {
  const { data: photoData } = useAllPhotosQuery(undefined, {
    select: (data) => data?.allPhotos?.find((photo) => photo?.id === id),
    enabled: !!id,
  });
  const exif = photoData?.exif && JSON.parse(photoData?.exif);
  const thumbnailUrl = `https://res.cloudinary.com/${cloudName}/image/upload/c_thumb,w_400,h_350/${photoData?.publicId}`;

  return (
    <div className="flex flex-col items-center">
      <h1>Photo Page</h1>
      <p>Photo id: {photoData?.id}</p>
      {photoData?.imageUrl && (
        <Magnifier
          className="relative w-1/2"
          imageAlt={photoData?.title || id}
          imageSrc={thumbnailUrl}
          largeImageSrc={photoData?.imageUrl}
        />
      )}
    </div>
  );
}
