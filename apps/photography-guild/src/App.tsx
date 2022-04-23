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
    </div>
  );
}
