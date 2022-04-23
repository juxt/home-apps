import ReactImageMagnify from '@blacklab/react-image-magnify';
import { useAllPhotosQuery } from '../generated/graphql';
import { ExifType } from './types';

function photoDimensions(exif: ExifType): [number, number] {
  const { width, height } = exif;
  return [
    width ? parseInt(width.replace('px', ''), 10) : 0,
    height ? parseInt(height.replace('px', ''), 10) : 0,
  ];
}

export function PhotoPage({ id }: { id?: string }) {
  const { data: photoData } = useAllPhotosQuery(undefined, {
    select: (data) => data?.allPhotos?.find((photo) => photo?.id === id),
    enabled: !!id,
  });
  const exif = photoData?.exif && JSON.parse(photoData?.exif);
  const [width, height] = exif
    ? photoDimensions(exif as unknown as ExifType)
    : [0, 0];
  console.log(width, height, exif);

  return (
    <div className="block">
      <h1>Photo Page</h1>
      <p>Photo id: {photoData?.id}</p>
      {photoData?.imageUrl && (
        <ReactImageMagnify
          imageProps={{
            alt: 'user image',
            src: photoData.imageUrl,
            height: height / 20,
            width: width / 20,
          }}
          magnifiedImageProps={{
            src: photoData.imageUrl,
            height: 600,
            width: 400,
          }}
        />
      )}
    </div>
  );
}
