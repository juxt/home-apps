import { notEmpty } from '@juxt-home/utils';
import classNames from 'classnames';
import { Fragment } from 'react';

type MetadataItem = {
  label: string;
  value?: string | null;
  type?: 'date' | 'text' | 'number';
  hidden?: boolean;
};

export function MetadataGrid({
  metadata,
  title,
  children,
}: {
  metadata: MetadataItem[];
  title: string;
  children?: React.ReactNode;
}) {
  const metadataLabelClass = classNames(
    'text-sm font-medium text-gray-700 font-bold',
  );
  const metadataClass = classNames('text-sm font-medium text-gray-700');
  return (
    <div className="mx-4 flex flex-col isolate min-w-min sm:overflow-y-auto">
      <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
        {title}
      </h2>
      <div className="grid grid-cols-2 text-left my-4">
        {metadata
          .filter((item) => item?.value && !item?.hidden)
          .filter(notEmpty)
          .map((item) => (
            <Fragment key={item?.label}>
              <p className={metadataLabelClass}>{item.label}</p>
              <p className={metadataClass}>
                {item?.value && item.type === 'date'
                  ? new Date(item.value).toLocaleDateString()
                  : item.type === 'number'
                  ? item.value
                  : item.value}
              </p>
            </Fragment>
          ))}
      </div>
      {children}
    </div>
  );
}
