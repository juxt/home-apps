import { useState } from 'react';
import { GlassMagnifier, Magnifier } from 'react-image-magnifiers';
import { cloudName } from '../constants';
import { useAllPhotosQuery } from '../generated/graphql';

export function PhotoPage({ id }: { id?: string }) {
  const { data: photoData } = useAllPhotosQuery(undefined, {
    select: (data) => data?.allPhotos?.find((photo) => photo?.id === id),
    enabled: !!id,
  });
  const exif = photoData?.exif && JSON.parse(photoData?.exif);
  const thumbnailUrl = `https://res.cloudinary.com/${cloudName}/image/upload/c_thumb,w_400,h_350/${photoData?.publicId}`;
  const [magnifierType, setMagnifierType] = useState<'glass' | 'magnifier'>(
    'glass',
  );

  return (
    <div className="flex flex-col items-center">
      <h1>Photo Page</h1>
      <p>Photo id: {photoData?.id}</p>
      <button
        className={magnifierType === 'glass' ? 'opacity-50' : ''}
        onClick={() => setMagnifierType('glass')}
        disabled={magnifierType === 'glass'}
        type="button">
        Glass magnifier
      </button>
      <button
        className={magnifierType === 'magnifier' ? 'opacity-50' : ''}
        onClick={() => setMagnifierType('magnifier')}
        disabled={magnifierType === 'magnifier'}
        type="button">
        Click to Magnify magnifier
      </button>
      {photoData?.imageUrl && (
        <div className="flex flex-col items-center relative w-1/2">
          {magnifierType === 'glass' && (
            <GlassMagnifier
              imageSrc={photoData.imageUrl}
              largeImageSrc={photoData.imageUrl}
              magnifierSize="200"
              cursorStyle="crosshair"
            />
          )}
          {magnifierType === 'magnifier' && (
            <Magnifier
              imageAlt={photoData?.title || id}
              imageSrc={thumbnailUrl}
              largeImageSrc={photoData?.imageUrl}
            />
          )}
        </div>
      )}
    </div>
  );
}
