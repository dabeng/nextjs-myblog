"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { AddEdit } from "_components/blogs";
import { Spinner } from "_components";
import { useBlogService, IBlog } from "_services";
/*
The edit blog page renders the add/edit user component with the specified user so the component
* is set to "edit" mode.
*/
export default function Edit() {
  const { id } = useParams<{ id: string }>();
  const blogService = useBlogService();

  const { data, error, isLoading } = useQuery({
    queryKey: ['blogs', 'detail', id],
    queryFn: () => blogService.getById(id)
  });


  if (isLoading) return <div style={{ "height": "600px", "fontSize": "64px" }}><Spinner /></div>;
  if (error) return <p>Error loading blog: {error.message}</p>;

  return <AddEdit title="Edit Blog" blog={data} />;

}
