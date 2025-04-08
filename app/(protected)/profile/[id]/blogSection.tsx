
"use client"

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useBlogService, IBlog } from "_services";
import { Spinner } from "_components";
// import { useSession } from "next-auth/react";

export default BlogSection;

function BlogSection({authorId}:{authorId:string}) {



  const blogService = useBlogService();
  const { data: blogs, error, isPending, isSuccess } = useQuery({
    queryKey: ["blogs", 'list', authorId],
    queryFn: () => blogService.getAllByAuthor(authorId)
  });

  const queryClient = useQueryClient();
  const deleteBlogMutation = useMutation({
    mutationFn: (id: string) => {
      return blogService.delete(id);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ['blogs', 'list']
      });
    },
  });
  return (
    <>
      <p>
        <Link className="button is-dark mt-5 mb-5" href="/blogs/add">Write New Post</Link>
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
            No Blogs To Display
          </div>
        )
      }
      {
        blogs && (blogs as Array<IBlog>).length === 0 && (
          <div className="text-center">
            No Blogs To Display
          </div>
        )
      }
      {
        blogs?.map(blog => (
          <div key={blog.id} className="card">
            <div className="card-content">
              <div className="content">
                <p>
                  <span className="mr-5">{blog.author.username}</span>
                  <span className="mr-5">PUBLISHED: <time>{(new Date(blog.createdAt)).toLocaleDateString('zh-Hans-CN')}</time></span>
                  <span></span>
                </p>
                {blog.title}
              </div>
            </div>
          </div>
        ))
      }
    </>
  );

}
