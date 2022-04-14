import { useUser } from '@juxt-home/site';
import * as yup from 'yup';
import {
  DeleteActiveIcon,
  DeleteInactiveIcon,
  OptionsMenu,
  StandaloneForm,
} from '@juxt-home/ui-common';
import { notEmpty } from '@juxt-home/utils';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import {
  CreatePhotoMutationVariables,
  useAllPhotosQuery,
  useCreatePhotoMutation,
  useDeletePhotoMutation,
} from './generated/graphql';
import { CreatePhotoInputSchema } from './generated/validation';
import { yupResolver } from '@hookform/resolvers/yup';

export function App() {
  const { id: userId } = useUser();
  const { data } = useAllPhotosQuery();

  const schema = yup.object({
    input: CreatePhotoInputSchema(),
  });

  const formHooks = useForm<CreatePhotoMutationVariables>({
    resolver: yupResolver(schema),
  });
  const queryClient = useQueryClient();
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
  const createPhoto = ({ input }: CreatePhotoMutationVariables) => {
    createPhotoMutator({
      input: {
        id: `Photo-${input.title}-${Date.now()}`,
        ...input,
      },
    });
  };
  const { mutate: deletePhotoMutator } = useDeletePhotoMutation({
    onSuccess: (resp) => {
      toast.success(`Photo deleted`);
      const id = resp.deletePhoto?.id;
      if (id) {
        queryClient.refetchQueries(useAllPhotosQuery.getKey());
      }
    },
  });

  return (
    <div className="max-w-xl mx-auto prose">
      <h1>my photos</h1>
      {data?.allPhotos?.filter(notEmpty).map((photo) => (
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
      ))}
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
            label: 'Image',
            type: 'text',
            path: 'input.imageUrl',
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
  );
}
