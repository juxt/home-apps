import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Placeholder from "@tiptap/extension-placeholder";

import type { Extensions } from "@tiptap/react";
import {
  EmojiSuggestion,
  MentionSuggestion,
  EmojiReplacer,
  HexColorDecorator,
} from "./extensions";
import { formatHtml, markdownToHtml, htmlToMarkdown } from "./helpers/";

import { Toolbar } from "./Toolbar";
import { Popover } from "./Popover";

import "./Tiptap.scss";

export type TiptapProps = {
  content?: string;
  onChange: (content: string) => void;
  editable?: boolean;
  placeholder?: string;
  withTypographyExtension?: boolean;
  withLinkExtension?: boolean;
  withTaskListExtension?: boolean;
  withPlaceholderExtension?: boolean;
  withMentionSuggestion?: boolean;
  withEmojiSuggestion?: boolean;
  withEmojisReplacer?: boolean;
  withHexColorsDecorator?: boolean;
};

function Tiptap({
  content = "",
  onChange,
  editable = true,
  placeholder = "Type '/' for actions…",
  withTypographyExtension = false,
  withLinkExtension = false,
  withTaskListExtension = false,
  withPlaceholderExtension = false,
  withMentionSuggestion = false,
  withEmojiSuggestion = false,
  withEmojisReplacer = false,
  withHexColorsDecorator = false,
}: TiptapProps) {
  const extensions: Extensions = [StarterKit.configure()];

  if (withTypographyExtension) {
    extensions.push(Typography);
  }

  if (withLinkExtension) {
    extensions.push(
      Link.configure({
        linkOnPaste: false,
        openOnClick: false,
      })
    );
  }

  if (withTaskListExtension) {
    extensions.push(TaskList, TaskItem);
  }

  if (withPlaceholderExtension) {
    extensions.push(
      Placeholder.configure({
        placeholder,
      })
    );
  }

  if (withMentionSuggestion) {
    extensions.push(MentionSuggestion);

    /*extensions.push(
            MentionSuggestion.configure({
                suggestion: {
                    char: '+',
                },
            }),
        )*/
  }

  if (withEmojiSuggestion) {
    extensions.push(EmojiSuggestion);
  }

  if (withEmojisReplacer) {
    extensions.push(EmojiReplacer);
  }

  if (withHexColorsDecorator) {
    extensions.push(HexColorDecorator);
  }

  const [editorHtmlContent, setEditorHtmlContent] = React.useState(
    content.trim()
  );
  const [turndownMarkdownContent, setTurndownMarkdownContent] =
    React.useState("");
  const [markedHtmlContent, setMarkedHtmlContent] = React.useState("");

  const editor = useEditor({
    content,
    extensions,
    editable,
    onUpdate: ({ editor }) => {
      setEditorHtmlContent(editor.getHTML());
    },
  });

  React.useEffect(
    function convertHtmlToMarkdown() {
      setTurndownMarkdownContent(htmlToMarkdown(editorHtmlContent));
      onChange(editorHtmlContent);
    },
    [editorHtmlContent]
  );

  React.useEffect(
    function convertMarkdownToHtml() {
      setMarkedHtmlContent(markdownToHtml(turndownMarkdownContent));
    },
    [turndownMarkdownContent]
  );

  if (!editor) {
    return null;
  }

  return (
    <>
      <Toolbar editor={editor} />
      <Popover editor={editor} />
      <EditorContent editor={editor} />
    </>
  );
}

export { Tiptap };
