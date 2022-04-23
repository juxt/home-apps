import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { thumbnail } from '@cloudinary/url-gen/actions/resize';
import ExifReader from 'exifreader';
import React, { useEffect, useState } from 'react';
import { CloudinaryImageFields, ExifType } from './types';

// this is a global var coming from cloudinary js script in index.html
declare const cloudinary: any;
const cloudName = 'dzwm2uynx';
const presetName = 'wqbfsiai';

type CloudinaryUploadWidgetProps = {
  setCloudinaryImage: React.Dispatch<
    React.SetStateAction<CloudinaryImageFields>
  >;
};

export function CloudinaryUploadWidget({
  setCloudinaryImage,
}: CloudinaryUploadWidgetProps) {
  const [widgetInstance, setWidgetInstance] =
    useState<{ open: () => unknown }>();

  useEffect(() => {
    const w = cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset: presetName,
      },
      async (
        error: unknown,
        result: { event: string; info: CloudinaryInfo },
      ) => {
        if (!error && result && result.event === 'success') {
          const exif: Record<string, { description: string }> =
            await ExifReader.load(result.info.secure_url);

          const exifSelection: ExifType = {
            fNumber: exif['FNumber']?.description,
            focalLength: exif['FocalLength']?.description,
            shutterSpeed: exif['ShutterSpeedValue']?.description,
            iso: exif['ISOSpeedRatings']?.description,
            dateTime: exif['DateTimeOriginal']?.description,
            lensSpec: exif['LensSpecification']?.description,
            make: exif['Make']?.description,
            width: exif['Image Width']?.description,
            height: exif['Image Height']?.description,
          };

          setCloudinaryImage({
            publicId: result.info.public_id,
            imageUrl: result.info.secure_url,
            exif: JSON.stringify(exifSelection),
          });
        }
      },
    );

    setWidgetInstance(w);
  }, []);

  return (
    <>
      {widgetInstance && (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="button"
          onClick={() => widgetInstance.open()}>
          Upload Image
        </button>
      )}
    </>
  );
}

const cld = new Cloudinary({
  cloud: {
    cloudName,
  },
});

type CloudinaryImageProps = {
  publicId: string;
};

export function CloudinaryImage({ publicId }: CloudinaryImageProps) {
  const myImage = cld.image(publicId);
  myImage.resize(thumbnail().width(250).height(250));

  return (
    <div>
      <AdvancedImage cldImg={myImage} />
    </div>
  );
}

type CloudinaryInfo = {
  access_mode: string;
  asset_id: string;
  batchId: string;
  bytes: number;
  created_at: string;
  etag: string;
  format: string;
  height: number;
  id: string;
  original_filename: string;
  path: string;
  placeholder: false;
  public_id: string;
  resource_type: string;
  secure_url: string;
  signature: string;
  length: number;
  thumbnail_url: string;
  type: string;
  url: string;
  version: number;
  version_id: string;
  width: number;
};

const mockCloudinaryResponse = {
  access_mode: 'public',
  asset_id: '456bec7c34cecffea5d33aa46bb3d765',
  batchId: 'uw-batch2',
  bytes: 773801,
  created_at: '2022-04-20T21:13:02Z',
  etag: '23e19145b6ab4c8dee54db1098f613c5',
  format: 'jpg',
  height: 2757,
  id: 'uw-file3',
  original_filename: 'DSC05276',
  path: 'v1650489182/z3kk8qgn1afpneszcilh.jpg',
  placeholder: false,
  public_id: 'z3kk8qgn1afpneszcilh',
  resource_type: 'image',
  secure_url:
    'https://res.cloudinary.com/dzwm2uynx/image/upload/v1650489182/z3kk8qgn1afpneszcilh.jpg',
  signature: '0a345ed2b0971912622da73897c4e96827573cb7',
  length: 0,
  thumbnail_url:
    'https://res.cloudinary.com/dzwm2uynx/image/upload/c_limit,h_60,w_90/v1650489182/z3kk8qgn1afpneszcilh.jpg',
  type: 'upload',
  url: 'http://res.cloudinary.com/dzwm2uynx/image/upload/v1650489182/z3kk8qgn1afpneszcilh.jpg',
  version: 1650489182,
  version_id: 'fd60fb545437f2adf2b552761245826c',
  width: 4135,
};
