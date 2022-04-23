import { useUser } from '@juxt-home/site';
import {
  OptionsMenu,
  DeleteInactiveIcon,
  DeleteActiveIcon,
} from '@juxt-home/ui-common';
import { notEmpty } from '@juxt-home/utils';
import { Link } from '@tanstack/react-location';
import classNames from 'classnames';
import { Fragment } from 'react';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { assetPath } from '../constants';
import {
  useAllPhotosQuery,
  useDeletePhotoMutation,
} from '../generated/graphql';
import { useLocationQuery } from '../hooks';
import { CloudinaryImage } from './Cloudinary';
import { LocationIcon } from './icons';
import { ExifType } from './types';

function ExifSingleEntry({
  image,
  Icon,
  value,
}: {
  image?: string;
  Icon?: React.FC;
  value?: string | number;
}) {
  return (
    <>
      {value && (
        <div className="flex gap-2 items-center" style={{ minWidth: '6rem' }}>
          {image ? (
            <img
              className="m-0"
              src={`${assetPath}/${image}.png`}
              alt={image}
              width="24px"
            />
          ) : (
            Icon && <Icon />
          )}
          <div className="text-sm"> {value} </div>
        </div>
      )}
    </>
  );
}

function ExifInfo({ exifData }: { exifData: ExifType }) {
  const {
    Model,
    ISOSpeedRatings,
    Make,
    ExposureTime,
    GPSLatitude,
    GPSLongitude,
  } = exifData;
  const long = GPSLongitude?.description.toString();
  const lat = GPSLatitude?.description.toString();
  const locationData = useLocationQuery(lat, long);
  const lens = exifData.LensModel?.description;
  const lensModel = lens === '----' ? 'Manual Lens' : lens;
  const apertureDesc = exifData.FNumber?.description;
  const fNumber = apertureDesc !== 'f/0' && apertureDesc;
  const focalDescription = exifData.FocalLength?.description;
  const focalLength = focalDescription !== '0mm' && focalDescription;

  return (
    <div>
      {Make && Model && (
        <div className="flex gap-4 items-center pb-6">
          <img
            className="shrink-0 w-28"
            src={`${assetPath}/sonyCameraIcon.png`}
            alt="camera icon"
          />
          <div className="flex flex-col gap-1 text-sm">
            <div className="font-semibold">{Make?.description}</div>
            <div>{Model?.description}</div>
            <div className="text-xs italic text-gray-600 w-1/2">
              {lensModel}
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-4 max-w-min">
        {fNumber && focalLength && (
          <div className="flex">
            <ExifSingleEntry image="apertureIcon" value={fNumber} />
            <ExifSingleEntry image="focalLengthIcon" value={focalLength} />
          </div>
        )}
        <div className="flex">
          <ExifSingleEntry
            image="shutterSpeedIcon"
            value={ExposureTime?.description}
          />
          <ExifSingleEntry
            image="isoIcon"
            value={ISOSpeedRatings?.description}
          />
        </div>
        {locationData.data && (
          <ExifSingleEntry
            Icon={LocationIcon}
            value={locationData.data.label}
          />
        )}
      </div>
    </div>
  );
}

function StarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 fill-gray-700"
      viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  );
}

function RatingStars({ rating }: { rating: number }) {
  const ratings = [...Array(5).keys()].map((x) => x + 1);

  return (
    <div className="flex flex-row-reverse">
      {ratings.map((x) => rating >= x && <StarIcon key={x} />)}
    </div>
  );
}

export function Gallery() {
  const { data } = useAllPhotosQuery();
  const { id: userId } = useUser();

  const queryClient = useQueryClient();

  const { mutate: deletePhotoMutator } = useDeletePhotoMutation({
    onSuccess: (resp) => {
      toast.success(`Photo deleted`);
      const id = resp.deletePhoto?.id;
      if (id) {
        queryClient.refetchQueries(useAllPhotosQuery.getKey());
      }
    },
  });

  return (
    <div className="flex flex-wrap gap-1">
      {data?.allPhotos
        ?.filter(notEmpty)
        .map(({ publicId, id, exif, _siteSubject, imageUrl, rating }) => {
          const exifData: ExifType = exif && JSON.parse(exif);

          return (
            <Fragment key={id}>
              {publicId && (
                <div className="flex" key={id}>
                  <div className="relative group">
                    {imageUrl && (
                      <CloudinaryImage
                        publicId={publicId}
                        imageUrl={imageUrl}
                      />
                    )}
                    <Link to={`/photos/${id}`}>
                      <div
                        className={classNames(
                          'opacity-0 group-hover:opacity-100 duration-300 absolute top-0 w-full',
                          'h-full flex p-6 items-center text-xl bg-gray-50/80 text-black',
                        )}>
                        <ExifInfo exifData={exifData} />
                        {rating && (
                          <div className="p-2 absolute bottom-0 right-0 w-full flex justify-end">
                            <RatingStars rating={rating} />
                            {exifData.DateTimeOriginal?.description && (
                              <div className="text-xs text-gray-800 p-2 absolute bottom-0 left-0">
                                {exifData.DateTimeOriginal.description}
                              </div>
                            )}
                          </div>
                        )}
                        <div className="absolute top-2 right-0">
                          <OptionsMenu
                            options={[
                              {
                                label: 'Delete',
                                id: 'delete',
                                hidden:
                                  userId !== 'devUser' &&
                                  userId !== _siteSubject,
                                Icon: DeleteInactiveIcon,
                                ActiveIcon: DeleteActiveIcon,
                                props: {
                                  onClick: () => deletePhotoMutator({ id }),
                                },
                              },
                            ]}
                          />
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </Fragment>
          );
        })}
    </div>
  );
}
