
"use client"

import React, {MouseEvent} from 'react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";

import { useBlogService, IBlog, useAlertService } from "_services";
import { Spinner } from "_components";
import { Pagination } from "_components";

import styles from "./styles.module.css";

export default BlogSection;

function BlogSection({ author }: { author: string }) {
  const router = useRouter();
  const alertService = useAlertService();
  const blogService = useBlogService();

  const [page, setPage] = useState(1);
  const { data: blogs, isPending, isFetching, isError, error, isPlaceholderData } = useQuery({
    queryKey: ['blogs', 'list', author, page],
    queryFn: () => blogService.getOnePage({ author, page }),
    placeholderData: keepPreviousData,
  });

  function jumpToPage(n: number) {
    setPage(n);
  };

  const queryClient = useQueryClient();
  const [deletedBlogId, setDeletedBlogId] = useState('');
  const deleteBlogMutation = useMutation({
    mutationFn: (id: string) => {
      return blogService.delete(id);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ['blogs', 'list', author]
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

  function openBlog(e: MouseEvent, id: string) {
    try {
      if (['blog-wrapper', 'blog-header', 'blog-title', 'blog-footer'].some(className => (e.target as HTMLDivElement).classList.contains(className))) {
        router.push(`/blogs/${id}`);
      }
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
        isError && (
          <div className="text-center">
            Error: {error.message}
          </div>
        )
      }
      {
        blogs?.data && (blogs.data as Array<IBlog>).length === 0 && (
          <div className="text-center">
            No Blogs To Display
          </div>
        )
      }
      {
        blogs?.data.map(blog => (
          <div key={blog.id} className={`card ${styles['blog-item']}`} onClick={(e) => openBlog(e, blog.id)}>
            <div className="card-content blog-wrapper" style={{ padding: '1rem' }}>
              <div className="content">
                <p className="is-flex is-justify-content-space-between blog-header">
                  <span>{blog.author.username}</span>
                  <span className="has-text-weight-light">
                    { blog.updatedAt > blog.createdAt &&  (
                      <span className="mr-4">UPDATED: <time>{(new Date(blog.updatedAt)).toLocaleDateString('zh-Hans-CN')}</time></span>
                    )}
                    <span>PUBLISHED: <time>{(new Date(blog.createdAt)).toLocaleDateString('zh-Hans-CN')}</time></span>
                  </span>
                </p>
                <p className='blog-title'>{blog.title}</p>
                <p className="is-flex is-justify-content-space-between blog-footer">
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
      {
        blogs?.data &&
        <Pagination total={blogs?.metadata.total} pageSize={4} visibleSize={5} onChange={jumpToPage} />
      }
    </>
  );

}
