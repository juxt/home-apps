import { MakeGenerics } from '@tanstack/react-location';

export type CloudinaryImageFields =
  | {
      exif: string;
      publicId: string;
      imageUrl: string;
    }
  | undefined;

export type ExifType = ExifReader.Tags &
  ExifReader.XmpTags &
  ExifReader.IccTags & {
    width?: string;
    height?: string;
  };

export type NavStructure = MakeGenerics<{
  Search: {
    query?: string;
    page?: number;
  };
  Params: {
    photoId?: string;
  };
}>;
