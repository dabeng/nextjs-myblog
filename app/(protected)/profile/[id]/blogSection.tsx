
"use client"

import Link from "next/link";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useBlogService, IBlog, useAlertService } from "_services";
import { Spinner } from "_components";

export default BlogSection;

function BlogSection({ authorId }: { authorId: string }) {
  const [deletedBlogId, setDeletedBlogId] = useState('');
  const alertService = useAlertService();


  const blogService = useBlogService();
  const { data: blogs, error, isPending, isSuccess } = useQuery({
    queryKey: ['blogs', 'list', authorId],
    queryFn: () => blogService.getAllByAuthor(authorId)
  });

  const queryClient = useQueryClient();
  const deleteBlogMutation = useMutation({
    mutationFn: (id: string) => {
      return blogService.delete(id);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ['blogs', 'list', authorId]
      });
    },
  });
  async function deleteBlog(id: string) {
    try {
      setDeletedBlogId(id);
      alertService.clear();
      await deleteBlogMutation.mutateAsync(id);
      alertService.success(`Blog(${id}) has been deleted`, true);
    } catch (error: any) {
      alertService.error(error);
    }
  }

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
            <div className="card-content" style={{ padding: '1rem' }}>
              <div className="content">
                <p className="is-flex is-justify-content-space-between">
                  <span>{blog.author.username}</span>
                  <span>PUBLISHED: <time>{(new Date(blog.createdAt)).toLocaleDateString('zh-Hans-CN')}</time></span>
                </p>
                <p>{blog.title}</p>
                <p className="is-flex is-justify-content-space-between">
                  <span>
                    <span className="icon">
                      <i className="fa-regular fa-thumbs-up"></i>
                    </span>
                    <span className="icon">
                      <i className="fa-regular fa-face-laugh-squint"></i>
                    </span>
                    <span className="icon">
                      <i className="fa-regular fa-face-kiss-wink-heart"></i>
                    </span>
                    <span className="icon">
                      <i className="fa-regular fa-face-surprise"></i>
                    </span>
                    <span className="icon">
                      <i className="fa-regular fa-face-angry"></i>
                    </span>
                    <span className="icon">
                      <i className="fa-regular fa-face-sad-tear"></i>
                    </span>
                  </span>
                  <span className="buttons">
                    <Link
                      href={`/blogs/edit/${blog.id}`}
                      className="button is-dark is-small"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteBlog(blog.id)}
                      className="button is-small"
                      style={{ width: "60px" }}
                      disabled={deletedBlogId === blog.id && deleteBlogMutation.isPending}
                    >
                      <span>Delete</span>
                      {deletedBlogId === blog.id && deleteBlogMutation.isPending && (
                        <span className="icon ml-0">
                          <i className="fa-solid fa-circle-notch fa-spin"></i>
                        </span>
                      )}
                    </button>
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))
      }
    </>
  );

}
