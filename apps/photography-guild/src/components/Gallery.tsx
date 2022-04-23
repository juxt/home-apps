import { notEmpty } from '@juxt-home/utils';
import { useAllPhotosQuery } from '../generated/graphql';
import { CloudinaryImage } from './Cloudinary';
import { ExifType } from './types';

function ExifSingleEntry({
  image,
  value,
}: {
  image: string;
  value: string | number;
}) {
  return (
    <>
      {value && (
        <div className="flex gap-2 items-center" style={{ minWidth: '6rem' }}>
          <img
            className="m-0"
            src={`/assets/${image}.png`}
            alt={image}
            width="24px"
          />
          <div className="text-sm"> {value} </div>
        </div>
      )}
    </>
  );
}

function ExifInfo({ exifData }: { exifData: ExifType }) {
  const {
    dateTime,
    height,
    width,
    fNumber,
    focalLength,
    iso,
    lensSpec,
    make,
    shutterSpeed,
  } = exifData;

  return (
    <div>
      {make && lensSpec && (
        <div className="flex gap-4 items-center">
          <img
            className="shrink-0 w-2/6"
            src="/assets/sonyCameraIcon.png"
            alt="camera icon"
          />
          <div className="flex flex-col gap-1 text-sm">
            <div className="font-semibold">{make}</div>
            <div className="italic text-gray-500">{lensSpec}</div>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-4">
        <div className="flex">
          <ExifSingleEntry image="apertureIcon" value={fNumber} />
          <ExifSingleEntry image="focalLengthIcon" value={focalLength} />
        </div>
        <div className="flex">
          <ExifSingleEntry image="shutterSpeedIcon" value={shutterSpeed} />
          <ExifSingleEntry image="isoIcon" value={iso} />
        </div>
      </div>
    </div>
  );
}

export function Gallery() {
  const { data } = useAllPhotosQuery();

  return (
    <div className="flex flex-wrap">
      {data?.allPhotos?.filter(notEmpty).map(({ publicId, exif }) => {
        const exifData: ExifType = exif && JSON.parse(exif);
        return (
          <>
            {publicId && (
              <div className="flex" key={publicId}>
                <ExifInfo exifData={exifData} />
                <CloudinaryImage publicId={publicId} />
              </div>
            )}
          </>
        );
      })}
    </div>
  );
}
