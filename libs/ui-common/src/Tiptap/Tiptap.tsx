import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Typography from '@tiptap/extension-typography';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Placeholder from '@tiptap/extension-placeholder';

import type { Extensions } from '@tiptap/react';
import { MentionSuggestion } from './extensions';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { sanitize } from 'isomorphic-dompurify';

export type TiptapProps = {
  content?: string | null;
  onChange: (content: string) => void;
  editable?: boolean;
  placeholder?: string;
  withTypographyExtension?: boolean;
  withLinkExtension?: boolean;
  withTaskListExtension?: boolean;
  withPlaceholderExtension?: boolean;
  withMentionSuggestion?: boolean;
};

function Tiptap({
  content = '',
  onChange,
  editable = true,
  placeholder = 'Write something...',
  withTypographyExtension = false,
  withLinkExtension = false,
  withTaskListExtension = false,
  withPlaceholderExtension = false,
  withMentionSuggestion = false,
}: TiptapProps) {
  const extensions: Extensions = [StarterKit.configure(), Highlight];

  if (withTypographyExtension) {
    extensions.push(Typography);
  }

  if (withLinkExtension) {
    extensions.push(
      Link.configure({
        linkOnPaste: false,
        openOnClick: false,
      }),
    );
  }

  if (withTaskListExtension) {
    extensions.push(TaskList, TaskItem);
  }

  if (withPlaceholderExtension) {
    extensions.push(
      Placeholder.configure({
        placeholder,
      }),
    );
  }

  if (withMentionSuggestion) {
    extensions.push(MentionSuggestion);
  }
  const tiptapEditor = useEditor({
    content,
    extensions,
    editable,
    editorProps: {
      attributes: {
        class: classNames(
          'prose-sm sm:prose focus:outline-none',
          'h-20 sm:h-56 w-full max-w-none rounded leading-none text-gray-700 bg-gray-50 border border-gray-300 p-3 text-base',
          'overflow-y-auto focus:outline-none',
          editable &&
            'transition-colors ease-in-out placeholder-gray-500 hover:border-blue-400 focus:outline-none focus:border-blue-400 focus:ring-blue-400 focus:ring-4 focus:ring-opacity-30',
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });
  if (!tiptapEditor) {
    return null;
  }
  if (content === '' || content === '<p></p>') {
    tiptapEditor.commands.clearContent();
  }
  return (
    <div className="w-full">
      <EditorContent editor={tiptapEditor} />
    </div>
  );
}

function TipTapContent({
  htmlString,
  className,
}: {
  htmlString: string;
  className?: string;
}) {
  return (
    <div
      className={classNames(
        'ProseMirror h-min max-h-32 w-full my-2 overflow-y-auto',
        className,
      )}
      dangerouslySetInnerHTML={{
        __html: sanitize(htmlString),
      }}
    />
  );
}

export { Tiptap, TipTapContent };
