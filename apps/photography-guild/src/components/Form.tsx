import { yupResolver } from '@hookform/resolvers/yup';
import { StandaloneForm } from '@juxt-home/ui-common';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import {
  CreatePhotoMutationVariables,
  useAllPhotosQuery,
  useCreatePhotoMutation,
} from '../generated/graphql';
import { CreatePhotoInputSchema } from '../generated/validation';
import { CloudinaryImageFields } from './types';

type ImageFormProps = {
  cloudinaryImage: CloudinaryImageFields;
  setCloudinaryImage: React.Dispatch<
    React.SetStateAction<CloudinaryImageFields>
  >;
};

export function ImageForm({
  cloudinaryImage,
  setCloudinaryImage,
}: ImageFormProps) {
  const queryClient = useQueryClient();
  const schema = yup.object({
    input: CreatePhotoInputSchema(),
  });

  const formHooks = useForm<CreatePhotoMutationVariables>({
    resolver: yupResolver(schema),
  });

  const { mutate: createPhotoMutator } = useCreatePhotoMutation({
    onSuccess: (resp) => {
      toast.success(
        'Submission received! Thank you for your service, 100 juxtcoins have been deposited in your account',
      );
      const id = resp.createPhoto?.id;
      if (id) {
        queryClient.refetchQueries(useAllPhotosQuery.getKey());
      }
    },
    onError: (error) => {
      toast.error(`Error adding photo ${error.message}`);
    },
  });

  const createPhoto = async ({ input }: CreatePhotoMutationVariables) => {
    if (cloudinaryImage) {
      const data = {
        input: {
          id: `Photo-${input.title}-${Date.now()}`,
          ...input,
          exif: cloudinaryImage.exif,
          publicId: cloudinaryImage.publicId,
          imageUrl: cloudinaryImage.imageUrl,
        },
      };
      await createPhotoMutator(data);
      setCloudinaryImage(undefined);
    }
  };

  return (
    <>
      {cloudinaryImage && (
        <div>
          <div> {cloudinaryImage.imageUrl} </div>
          <StandaloneForm
            title="Easy form"
            description="This is a form that can be used to create a new photo. Feel free to make your own form if you want more control"
            fields={[
              {
                label: 'Title',
                type: 'text',
                path: 'input.title',
              },
              {
                label: 'Description',
                type: 'text',
                path: 'input.description',
              },
              {
                label: 'Rating',
                type: 'text',
                path: 'input.rating',
              },
            ]}
            formHooks={formHooks}
            handleSubmit={() =>
              formHooks.handleSubmit(createPhoto, (error) =>
                toast.error(
                  Object.values(error.input || {})
                    ?.map((e) => e.message)
                    .join('\n'),
                ),
              )()
            }
          />
        </div>
      )}
    </>
  );
}
