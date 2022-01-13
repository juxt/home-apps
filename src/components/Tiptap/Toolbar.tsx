import React from "react";
import classNames from "classnames";
import { Editor } from "@tiptap/react";
import useInView from "react-cool-inview";
import {
  RiBold,
  RiItalic,
  RiStrikethrough,
  RiCodeSSlashLine,
  RiEmotionLine,
  RiH1,
  RiH2,
  RiH3,
  RiH4,
  RiH5,
  RiH6,
  RiParagraph,
  RiListOrdered,
  RiListUnordered,
  RiCodeBoxLine,
  RiLink,
  RiLinkUnlink,
  RiDoubleQuotesL,
  RiSeparator,
  RiTextWrap,
  RiFormatClear,
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
} from "react-icons/ri";

import { setLink } from "./helpers";

import "./Toolbar.scss";

type ToolbarProps = {
  editor: Editor;
};

function Toolbar({ editor }: ToolbarProps) {
  const isCursorOverLink = editor.getAttributes("link").href;

  const { observe, inView } = useInView({
    rootMargin: "-1px 0px 0px 0px",
    threshold: [1],
  });

  return (
    <div
      className={classNames("ToolbarContainer", { sticky: !inView })}
      ref={observe}
    >
      <div className="Toolbar overflow-auto no-scrollbar">
        <div
          className="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <RiBold />
        </div>
        <div
          className="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <RiItalic />
        </div>
        <div
          className="icon"
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <RiStrikethrough />
        </div>
        <div
          className="icon"
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <RiCodeSSlashLine />
        </div>
        <div className="divider"></div>
        <div
          className="icon"
          onClick={() => editor.chain().focus().insertEmoji("😀").run()}
        >
          <RiEmotionLine />
        </div>
        <div className="divider"></div>
        <div
          className="icon"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <RiH1 />
        </div>
        <div
          className="icon"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <RiH2 />
        </div>

        <div
          className="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <RiListOrdered />
        </div>
        <div
          className="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <RiListUnordered />
        </div>

        <div className="divider"></div>
        <div className="icon" onClick={() => setLink(editor)}>
          <RiLink />
        </div>
        <div
          className={classNames("icon", { disabled: !isCursorOverLink })}
          onClick={() => setLink(editor)}
        >
          <RiLinkUnlink />
        </div>
        <div className="divider"></div>
        <div
          className="icon"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <RiDoubleQuotesL />
        </div>
        <div
          className="icon"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <RiSeparator />
        </div>
        <div className="divider"></div>
        <div
          className="icon"
          onClick={() => editor.chain().focus().setHardBreak().run()}
        >
          <RiTextWrap />
        </div>
        <div
          className="icon"
          onClick={() =>
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }
        >
          <RiFormatClear />
        </div>
        <div className="divider"></div>
        <div
          className="icon"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <RiArrowGoBackLine />
        </div>
        <div
          className="icon"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <RiArrowGoForwardLine />
        </div>
      </div>
    </div>
  );
}

export { Toolbar };
