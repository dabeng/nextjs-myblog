"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Spinner, ForwardRefEditor } from "_components";
import { useBlogService, IBlog } from "_services";
import { isErrored } from "stream";
/*
The blog page renders the add/edit user component with the specified user so the component
* is set to "edit" mode.
*/
export default function Blog() {
  const { id } = useParams<{ id: string }>();
  const blogService = useBlogService();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['blogs', 'detail', id],
    queryFn: () => blogService.getById(id)
  });

  function formateDate(d: Date) {
    return (new Date(d)).toLocaleDateString('zh-Hans-CN');
  }


  if (isPending) return <div style={{ "height": "600px", "fontSize": "64px" }}><Spinner /></div>;

  if (isError) return (
    <article className="message is-danger">
      <div className="message-body">
        Error loading blog: {error.message}
      </div>
    </article>
  );

  return (
    <>
      <p className="has-text-weight-bold has-text-grey-light mt-6 mb-4">
        <span className="is-size-5 mr-4">{`${data.author.lastName} ${data.author.firstName}`}</span>
        {data.updatedAt &&
          <span className="is-size-6 is-pulled-right ml-4">
            UPDATED: {formateDate(data.updatedAt)}
          </span>
        }
        <span className="is-size-6 is-pulled-right">
          PUBLISHED: {formateDate(data.createdAt)}
        </span>
      </p>
      <div className="content">
        <p className="title is-1">{data.title}</p>
        <ForwardRefEditor markdown={data.content} contentEditableClassName="prose" />
      </div>
    </>
  );

}
