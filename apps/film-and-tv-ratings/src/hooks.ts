import { useCreateGrowTagMutation } from '@juxt-home/site';
import { useAllGrowTagsQuery } from '@juxt-home/site-public';
import { Option } from '@juxt-home/ui-common';
import { notEmpty } from '@juxt-home/utils';

export function useGrowTags(): [Option[], (tag: string) => void] {
  const createTagMutation = useCreateGrowTagMutation();
  const addTag = (tag: string) => {
    console.log('add tag', tag);
    const tagStr = tag.toLocaleLowerCase().trim();
    const id = `growTag-${tagStr}`;
    if (tagStr) {
      createTagMutation.mutate({
        growTag: {
          id,
          name: tagStr,
        },
      });
    }
    return {
      label: tagStr,
      value: id,
    };
  };
  const tags = useAllGrowTagsQuery();
  const tagOptions =
    tags.data?.allGrowTags?.filter(notEmpty).map((tag) => ({
      label: tag.name,
      value: tag.id,
    })) || [];

  return [tagOptions, addTag];
}
