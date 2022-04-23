export type CloudinaryImageFields =
  | {
      exif: string;
      publicId: string;
      imageUrl: string;
    }
  | undefined;

export type ExifType = {
  fNumber: string;
  focalLength: string;
  shutterSpeed: string;
  iso: string;
  dateTime: string;
  lensSpec: string;
  make: string;
  width: string;
  height: string;
};
