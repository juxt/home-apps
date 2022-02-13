import Resizer from 'react-image-file-resizer';
import { toast } from 'react-toastify';

export function utils(): string {
  return 'utils';
}

export function mapKeys<T, K extends keyof T>(
  obj: T,
  mapper: (key: K) => K
): { [P in K]: T[P] } {
  return Object.keys(obj).reduce((acc, key) => {
    return { ...acc, [mapper(key as K)]: obj[key as K] };
  }, {} as { [P in K]: T[P] });
}

export function isDefined<T>(argument: T | undefined): argument is T {
  return argument !== undefined;
}
export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  if (value === null || value === undefined) return false;
  return true;
}

export function distinctBy<T>(array: Array<T>, propertyName: keyof T) {
  return array.filter(
    (e, i) => array.findIndex((a) => a[propertyName] === e[propertyName]) === i
  );
}

export function indexById<T extends { id: string }>(
  array: Array<T>
): { [id: string]: T } {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item.id]: item,
    };
  }, initialValue);
}

export function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      200,
      200,
      'JPEG',
      60,
      0,
      (uri) => {
        resolve(uri.toString());
      },
      'base64'
    );
  });
}

export function base64FileToImage(file: File) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = () => {
      toast.error('Error reading file');
      reject(reader.error);
    };
  });
}

export function fileToString(file: File): Promise<string> {
  if (file.type.startsWith('image/')) {
    return compressImage(file);
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result?.toString() ?? '');
    };

    reader.onerror = () => {
      toast.error('Error reading file');
      reject(reader.error);
    };
  });
}

export const base64toBlob = (data: string) => {
  // Cut the prefix `data:application/pdf;base64` from the raw base 64
  const bytes = atob(data);
  let { length } = bytes;
  const out = new Uint8Array(length);

  // eslint-disable-next-line no-plusplus
  while (length--) {
    out[length] = bytes.charCodeAt(length);
  }

  return new Blob([out], { type: 'application/pdf' });
};

export function downloadFile(blob: Blob, filename: string) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  link.remove();
  // in case the Blob uses a lot of memory
  setTimeout(() => URL.revokeObjectURL(link.href), 7000);
}
