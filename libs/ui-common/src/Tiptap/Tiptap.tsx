import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Typography from '@tiptap/extension-typography';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Placeholder from '@tiptap/extension-placeholder';

import type { Extensions } from '@tiptap/react';
import { MentionSuggestion, TipTapCustomImage } from './extensions';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { sanitize } from 'isomorphic-dompurify';
import { CloseIcon, ExpandIcon } from '../Icons';
import { ArrowsExpandIcon, XIcon } from '@heroicons/react/solid';

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
  unstyled?: boolean;
  className?: string;
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
  unstyled = false,
  className = '',
}: TiptapProps) {
  const extensions: Extensions = [
    StarterKit.configure(),
    Highlight,
    TipTapCustomImage((image) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader?.result as string);
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(image);
      });
    }),
  ];

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
        class: !unstyled
          ? classNames(
              className,
              'prose-sm sm:prose focus:outline-none',
              'h-20 sm:h-56 w-full max-w-none rounded leading-none text-gray-700 bg-gray-50 border border-gray-300 p-3 text-base',
              'overflow-y-auto focus:outline-none',
              editable &&
                'transition-colors ease-in-out placeholder-gray-500 hover:border-blue-400 focus:outline-none focus:border-blue-400 focus:ring-blue-400 focus:ring-4 focus:ring-opacity-30',
            )
          : className,
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (
      tiptapEditor &&
      content &&
      content.length > 0 &&
      content !== '<p></p>' &&
      !tiptapEditor.isFocused &&
      !tiptapEditor.isDestroyed
    ) {
      tiptapEditor.commands.setContent('');
      tiptapEditor.commands.setContent(content);
    }
  }, [content, tiptapEditor]);

  useEffect(() => {
    return () => {
      if (tiptapEditor) {
        console.log('destroy');

        tiptapEditor.destroy();
      }
    };
  }, [tiptapEditor]);

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
  growButton,
}: {
  htmlString: string;
  className?: string;
  growButton?: boolean;
}) {
  const [grow, setGrow] = useState(false);
  const iconClass = classNames(
    'h-6 w-6 z-20 absolute -top-4 right-0 text-white bg-black opacity-50 hover:opacity-100',
    'scale-75 hover:scale-100 cursor-pointer',
  );
  const showGrowButton = growButton && htmlString.length > 200;
  return (
    <div className="relative w-full">
      {showGrowButton && grow && (
        <XIcon onClick={() => setGrow(false)} className={iconClass} />
      )}
      {showGrowButton && !grow && (
        <ArrowsExpandIcon onClick={() => setGrow(true)} className={iconClass} />
      )}
      <div
        className={classNames(
          ' ProseMirror w-full my-2 overflow-y-auto',
          grow ? 'max-h-max' : 'h-min max-h-32',
          className,
        )}
        dangerouslySetInnerHTML={{
          __html: sanitize(htmlString),
        }}
      />
    </div>
  );
}

export { Tiptap, TipTapContent };
