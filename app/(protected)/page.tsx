'use client'

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useBlogService, IBlog } from "_services";
import { Spinner } from "_components";
import { useSession } from "next-auth/react";
/*
 * The home page is a simple React component that displays a welcome message with the
 * logged in user's name and a link to the users section.
 */
export default Home;

function Home() {
  const { data: session } = useSession();
  const blogService = useBlogService();

  const { data: blogs, error, isPending, isSuccess } = useQuery({
    queryKey: ["blogs", 'list'],
    queryFn: () => blogService.getAll()
  });

  const queryClient = useQueryClient();
  const deleteBlogMutation = useMutation({
    mutationFn: (id: string) => {
      return blogService.delete(id);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ['users', 'list']
      });
    },
  });
  return (
    <>
    <p>
      <Link className="button is-dark mt-5 mb-5" href="/blogs/add">Write New One</Link>
    </p>
  {isPending && (
      <div style={{ "height": "80px", "fontSize": "64px" }}>
        <Spinner />
      </div>
    )
  }
  {
    error && (
        <div className="text-center">
          No Users To Display
        </div>
    )
  }
  {
    blogs && (blogs as Array<IBlog>).length === 0 && (
        <div className="text-center">
          No Users To Display
        </div>
    )
  }
  {
    blogs?.map(blog => (
      <div key={blog.id} className="card">
        <div className="card-content">
          <div className="content">
            {blog.title}
          </div>
        </div>
      </div>
    ))
  }
  </>
);

}
