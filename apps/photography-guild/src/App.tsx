import { Navbar } from '@juxt-home/ui-common';
import { useState } from 'react';
import { CloudinaryUploadWidget } from './components/Cloudinary';
import { ImageForm } from './components/Form';
import { Gallery } from './components/Gallery';
import { CloudinaryImageFields } from './components/types';

export function App() {
  const [cloudinaryImage, setCloudinaryImage] =
    useState<CloudinaryImageFields>();

  return (
    <div className="max-w-7xl mx-auto">
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
