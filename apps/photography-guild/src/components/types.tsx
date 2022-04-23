export type CloudinaryImageFields =
  | {
      exif: string;
      publicId: string;
      imageUrl: string;
    }
  | undefined;

export type ExifType = ExifReader.Tags &
  ExifReader.XmpTags &
  ExifReader.IccTags;
