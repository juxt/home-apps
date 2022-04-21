import { useUser } from '@juxt-home/site';
import {
  DeleteActiveIcon,
  DeleteInactiveIcon,
  OptionsMenu,
} from '@juxt-home/ui-common';
import { notEmpty } from '@juxt-home/utils';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import {
  CloudinaryImage,
  CloudinaryUploadWidget,
} from './components/Cloudinary';
import { ImageForm } from './components/Form';
import { Gallery } from './components/Gallery';
import { CloudinaryImageFields } from './components/types';
import { useAllPhotosQuery, useDeletePhotoMutation } from './generated/graphql';

export function App() {
  const { id: userId } = useUser();
  const { data } = useAllPhotosQuery();

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

  const [cloudinaryImage, setCloudinaryImage] =
    useState<CloudinaryImageFields>();

  return (
    <div className="max-w-xl mx-auto prose">
      <h1>my photos</h1>

      <CloudinaryUploadWidget setCloudinaryImage={setCloudinaryImage} />
      <ImageForm
        setCloudinaryImage={setCloudinaryImage}
        cloudinaryImage={cloudinaryImage}
      />

      <Gallery />
      {/* {data?.allPhotos?.filter(notEmpty).map((photo) => (
        <div className="flex justify-center items-center" key={photo.id}>
          <OptionsMenu
            options={[
              {
                label: 'Delete',
                id: 'delete',
                hidden: userId !== 'devUser' && userId !== photo?._siteSubject,
                Icon: DeleteInactiveIcon,
                ActiveIcon: DeleteActiveIcon,
                props: {
                  onClick: () => deletePhotoMutator({ id: photo.id }),
                },
              },
            ]}
          />
          <div className="flex flex-col">
            <h2>{photo.title}</h2>
            <p>{photo.description}</p>
            {photo.imageUrl && photo.title && (
              <img src={photo.imageUrl} alt={photo.title} />
            )}
            <p>rating = {photo.rating}</p>
          </div>
        </div>
      ))} */}
    </div>
  );
}
