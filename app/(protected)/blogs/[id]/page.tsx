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


  if (isPending) return <div style={{ "height": "600px", "fontSize": "64px" }}><Spinner /></div>;
  if (isError) return <p>Error loading blog: {error.message}</p>;

  return (
  <>
    <p className="title">{data?.title}</p>
    <ForwardRefEditor markdown={data?.content as string} contentEditableClassName="prose"/>
    </>
  );

}
