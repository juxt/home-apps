import React from 'react';
import { SuggestionProps } from '@tiptap/suggestion';

import { Mention } from '../../data';
import { SuggestionDropdown } from './SuggestionDropdown';

import type { SuggestionDropdownRef } from './SuggestionDropdown';

import './MentionDropdown.scss';

type MentionDropdownProps = Pick<SuggestionProps, 'command'> & {
  items: Mention[];
};

const MentionDropdown = React.forwardRef<
SuggestionDropdownRef,
MentionDropdownProps
>(({ items, command }, ref) => (
  <SuggestionDropdown
    forwardedRef={ref}
    items={items}
    onSelect={command}
    renderItem={({ name, staffRecord }) => (
      <div className="MentionDropdownItem">
        <img
          className="avatar"
          alt="avatar"
          src={`https://home.juxt.site/profiles/${staffRecord.juxtcode}.jpg`}
        />
        <span className="name">{name}</span>
      </div>
    )}
  />
));

export { MentionDropdown };
