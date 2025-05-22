'use client'

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";

import { useBlogService, useAlertService, IBlog } from "_services";
import { Spinner, Pagination } from "_components";
import { useSession } from "next-auth/react";

import styles from "./styles.module.css";
/*
 * The home page is a simple React component that displays a welcome message with the
 * logged in user's name and a link to the users section.
 */
export default Home;

function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const alertService = useAlertService();
  const blogService = useBlogService();

  const [page, setPage] = useState(1);
  const { data: blogs, isError, error, isPending, isSuccess } = useQuery({
    queryKey: ['blogs', 'list', page],
    queryFn: () => blogService.getOnePage({ page }),
    placeholderData: keepPreviousData,
  });

  function jumpToPage(n: number) {
    setPage(n);
  };

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
    <div className="mt-6">
      {isPending && (
        <div style={{ "height": "80px", "fontSize": "64px" }}>
          <Spinner />
        </div>
      )
      }
      {
        isError &&
        <div className="text-center">
          Error: {error.message}
        </div>
      }
      {
        blogs?.data && (blogs?.data as Array<IBlog>).length === 0 && (
          <div className="text-center">
            No Users To Display
          </div>
        )
      }
      {
        blogs?.data.map(blog =>
          <div key={blog.id} className={`card ${styles['blog-item']}`} onClick={(e) => openBlog(e, blog.id)}>
            <div className="card-content blog-wrapper" style={{ padding: '1rem' }}>
              <div className="content">
                <p className="is-flex is-justify-content-space-between blog-header">
                  <span>{blog.author.username}</span>
                  <span className="has-text-weight-light">
                    {blog.updatedAt > blog.createdAt && (
                      <span className="mr-4">UPDATED: <time>{(new Date(blog.updatedAt)).toLocaleDateString('zh-Hans-CN')}</time></span>
                    )}
                    <span>PUBLISHED: <time>{(new Date(blog.createdAt)).toLocaleDateString('zh-Hans-CN')}</time></span>
                  </span>
                </p>
                <p className='blog-title'>{blog.title}</p>
              </div>
            </div>
          </div>
        )
      }
      {
        blogs?.data &&
        <Pagination total={blogs?.metadata.total} pageSize={4} visibleSize={5} onChange={jumpToPage} />
      }
    </div>
  );

}
