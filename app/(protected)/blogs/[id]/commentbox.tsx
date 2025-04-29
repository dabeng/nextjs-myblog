"use client";

import React, { useRef } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Spinner, ForwardRefEditor } from "_components";
import { useBlogService, IBlog } from "_services";
import { isErrored } from "stream";
import {
  MDXEditor, headingsPlugin, listsPlugin, quotePlugin, thematicBreakPlugin, UndoRedo,
  BoldItalicUnderlineToggles, toolbarPlugin, InsertTable, InsertImage, imagePlugin, tablePlugin,
  ListsToggle, Separator, InsertThematicBreak, CodeBlockEditorDescriptor, useCodeBlockEditorContext,
  CreateLink, linkPlugin, linkDialogPlugin, BlockTypeSelect,
  insertCodeBlock$
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

import styles from "./styles.module.css";

interface ComentBoxProps {
  onPostComment: Function;
  parentComment?: string;
};

export default function CommentBox({ onPostComment, parentComment}: ComentBoxProps) {
  const commentRef = useRef(null);

  function submitComment() {
    if (parentComment) {
      onPostComment(commentRef.current?.getMarkdown(), parentComment);
    } else {
      onPostComment(commentRef.current?.getMarkdown());
    }
  }

  return (
    <>
      <button
        onClick={submitComment}
        className="button is-pulled-right"
        style={{ position: 'absolute', right: '4px', top: '2px', zIndex: 3 }}
      >
          Comment
      </button>
      <ForwardRefEditor ref={commentRef} markdown={''} contentEditableClassName={`prose ${styles.contentEditor}`} plugins={[
        toolbarPlugin({
          toolbarClassName: 'my-classname',
          toolbarContents: () => (
            <>
              <BlockTypeSelect />
              <BoldItalicUnderlineToggles /><Separator />
              <ListsToggle /><Separator />
              <CreateLink />
              <InsertImage />
              <InsertTable />
              <InsertThematicBreak />
            </>
          )
        }),
        linkPlugin(), linkDialogPlugin(),
        tablePlugin(),
        headingsPlugin(), listsPlugin(), quotePlugin(), thematicBreakPlugin()]}
      />
    </>
  );

}
function onPostComment(arg0: any) {
  throw new Error("Function not implemented.");
}

