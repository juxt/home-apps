import ExifReader from 'exifreader';
import React, { useEffect, useState } from 'react';
import { cloudName } from '../constants';
import { CloudinaryImageFields } from './types';

// this is a global var coming from cloudinary js script in index.html
declare const cloudinary: any;
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
          const exifRaw = await ExifReader.load(result.info.secure_url);

          setCloudinaryImage({
            publicId: result.info.public_id,
            imageUrl: result.info.secure_url,
            exif: JSON.stringify(exifRaw),
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

type CloudinaryImageProps = {
  publicId: string;
  imageUrl: string;
};

export function CloudinaryImage({ publicId, imageUrl }: CloudinaryImageProps) {
  const width = 400;
  const height = 350;
  const ThumbnailUrl = `https://res.cloudinary.com/${cloudName}/image/upload/c_thumb,w_${width},h_${height}/${publicId}`;
  return (
    <div>
      <img src={ThumbnailUrl} width={width} height={height} alt="user" />
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
