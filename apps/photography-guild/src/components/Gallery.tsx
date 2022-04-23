import { useUser } from '@juxt-home/site';
import {
  OptionsMenu,
  DeleteInactiveIcon,
  DeleteActiveIcon,
} from '@juxt-home/ui-common';
import { notEmpty } from '@juxt-home/utils';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
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
              src={`/assets/${image}.png`}
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
        <div className="flex gap-4 items-center">
          <img
            className="shrink-0 w-2/6"
            src="/assets/sonyCameraIcon.png"
            alt="camera icon"
          />
          <div className="flex flex-col gap-1 text-sm">
            <div className="font-semibold">{Make?.description}</div>
            <div>{Model?.description}</div>
            <div className="text-xs italic text-gray-500 w-1/2">
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
      <button onClick={() => console.dir(exifData)} type="button">
        Show All Data
      </button>
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
        .map(
          ({
            publicId,
            exif,
            _siteSubject,
            id,
            title,
            description,
            rating,
          }) => {
            const exifData: ExifType = exif && JSON.parse(exif);

            return (
              <>
                {publicId && (
                  <div className="flex" key={publicId}>
                    {/* <ExifInfo exifData={exifData} /> */}
                    <div>
                      <CloudinaryImage publicId={publicId} />
                    </div>
                    {/* <OptionsMenu
                      options={[
                        {
                          label: 'Delete',
                          id: 'delete',
                          hidden:
                            userId !== 'devUser' && userId !== _siteSubject,
                          Icon: DeleteInactiveIcon,
                          ActiveIcon: DeleteActiveIcon,
                          props: {
                            onClick: () => deletePhotoMutator({ id }),
                          },
                        },
                      ]}
                    /> */}
                    {/* <div className="flex flex-col">
                      <h2>{title}</h2>
                      <p>{description}</p>
                      <p>rating = {rating}</p>
                    </div> */}
                  </div>
                )}
              </>
            );
          },
        )}
    </div>
  );
}
