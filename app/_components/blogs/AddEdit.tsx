"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ForwardRefEditor } from "../MDXEditor";
import {
  MDXEditor, headingsPlugin, listsPlugin, quotePlugin, thematicBreakPlugin, UndoRedo,
  BoldItalicUnderlineToggles, toolbarPlugin, InsertTable, InsertImage, imagePlugin, tablePlugin,
  ListsToggle, Separator, InsertThematicBreak, CodeBlockEditorDescriptor, useCodeBlockEditorContext,
  CreateLink, linkPlugin, linkDialogPlugin, BlockTypeSelect
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';


import { useAlertService, useBlogService } from "_services";
import type { IBlog } from "_services";
/*
 * The users AddEdit component is used for both adding and editing users, it contains a form
 * built with the React Hook Form library and is used by the add user page and edit user page.
 */
export { AddEdit };

function AddEdit({ title, blog }: { title: string; blog?: any }) {
  const router = useRouter();
  const alertService = useAlertService();
  const blogService = useBlogService();

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: blog
  });
  const { errors } = formState;

  const fields = {
    title: register("title", { required: "Title is required" }),
    subtitle: register("subtitle", { required: "Subtitle is required" }),
    content: register("content", { required: "Subtitle is required" })
  };

  const queryClient = useQueryClient();
  const updateBlogMutation = useMutation({
    mutationFn: (data: IBlog) => {
      return blogService.update(blog.id, data);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ['blogs', 'detail', blog.id]
      });
    },
  });

  const createBlogMutation = useMutation({
    mutationFn: (data: IBlog) => {
      return blogService.create(data);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ['blogs', 'list']
      });
    },
  });

  async function onSubmit(data: any) {
    try {
      alertService.clear();
      // create or update blog based on blog prop
      let message;
      if (blog) {
        await updateBlogMutation.mutateAsync(data);
        message = "Blog updated";
      } else {
        await createBlogMutation.mutateAsync(data);
        message = "Blog added";
      }
      // redirect to user list with success message
      router.push("/");
      alertService.success(message, true);
    } catch (error: any) {
      alertService.error(error);
    }
  }

  async function imageUploadHandler(image: File) {
    const formData = new FormData()
    formData.append('image', image)
    // send the file to your server and return
    // the URL of the uploaded image in the response
    const response = await fetch('/uploads/new', {
      method: 'POST',
      body: formData
    })
    const json = (await response.json()) as { url: string }
    return json.url
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="title mt-5">{title}</h1>
      <div className="field">
        <label className="label">Title</label>
        <div className="control">
          <input
            {...fields.title}
            type="text"
            className={`input ${errors.title ? "is-danger" : ""}`}
          />
        </div>
        <p className="help is-danger">{errors.title?.message?.toString()}</p>
      </div>
      <div className="field">
        <label className="label">Subtitle</label>
        <div className="control">
          <input
            {...fields.subtitle}
            type="text"
            className={`input ${errors.subtitle ? "is-danger" : ""}`}
          />
        </div>
        <p className="help is-danger">{errors.subtitle?.message?.toString()}</p>
      </div>
      <div className="field">
        <label className="label">Content</label>
        <div className="control">
          <input
            {...fields.content}
            type="text"
            className={`input ${errors.content ? "is-danger" : ""}`}
          />
        </div>
        <p className="help is-danger">{errors.content?.message?.toString()}</p>
      </div>
      <ForwardRefEditor contentEditableClassName="prose" markdown="# Hello **world**!" plugins={[
        toolbarPlugin({
          toolbarClassName: 'my-classname',
          toolbarContents: () => (
            <>
              <UndoRedo /><Separator />
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
        imagePlugin({
          imageUploadHandler
        }),
        linkPlugin(), linkDialogPlugin(),
        tablePlugin(),
        headingsPlugin(), listsPlugin(), quotePlugin(), thematicBreakPlugin()]}
      />


      <div className="field is-grouped">
        <div className="control">
          <button
            type="submit"
            disabled={formState.isSubmitting}
            className="button is-dark"
          >
            Save
            {formState.isSubmitting && (
              <span className="icon ml-0">
                <i className="fa-solid fa-circle-notch fa-spin"></i>
              </span>
            )}
          </button>
        </div>
        <div className="control">
          <button
            onClick={() => reset()}
            type="button"
            disabled={formState.isSubmitting}
            className="button"
          >
            Reset
          </button>
        </div>
        <div className="control">
          <Link href="/users" className="button">
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}
