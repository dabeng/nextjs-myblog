"use client";

import React, { useRef, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import classNames from 'classnames';

import { useAlertService, useCommentService, useVoteService, IComment, IVote, Vote } from "_services";
import CommentBox from "./commentbox";
import { set } from "mongoose";

export default function CommentList() {
  const { data: session } = useSession();
  const { id } = useParams<{ id: string }>();
  const alertService = useAlertService();
  const commentService = useCommentService();
  const voteService = useVoteService();

  const [sortFieldName, setSortFieldName] = useState('upvoteCount');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const {
    data: comments, isPending, isError, error, status,
    fetchNextPage, hasNextPage, isFetching, isFetchingNextPage
  } = useInfiniteQuery({
    // Treat useQuery's query keys like a dependency array of useEffect. Whenever the key changes query gets executed.
    // If you still want to control the firing of queries, you may explore the "enabled" option to the useQuery hook.
    queryKey: ['comments', 'list', id, sortFieldName, sortOrder],
    queryFn: ({ pageParam }) => commentService.getOnePage({
      blog: id, page: pageParam, sortFieldName, sortOrder
    }),
    initialPageParam: 1,
    // the following function returns undefined or null to indicate there is no next page available.
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => lastPage.metadata.nextPage,
  });
  const [boxVisible, setBoxVisible] = useState(Array<boolean>);
  const [commentBodyVisible, setCommentBodyVisible] = useState(Array<boolean>);
  const [childCommentBodyVisible, setChildCommentBodyVisible] = useState(new Map());

  function sortBy(field:string, order: 'asc' | 'desc') {
    setSortFieldName(field);
    setSortOrder(order);
  }

  useEffect(() => {
    if (status === 'success') {
      setBoxVisible(comments.pages.map(p => new Array(p.data.length).fill(false)).flat());
      setCommentBodyVisible(comments.pages.map(p => new Array(p.data.length).fill(true)).flat());
      const temp = new Map();
      comments.pages.forEach(p => {
        for (const [index, pc] of p.data.entries()) {
          if (pc.children?.length) {
            temp.set(index, new Array(pc.children.length).fill(true));
          }
        }
      }
      );

      setChildCommentBodyVisible(temp);
    }
  }, [status, comments]);

  function showBox(targetIndex: number) {
    setBoxVisible(boxVisible?.map((v, i) => {
      if (i === targetIndex) {
        return !v;
      } else {
        return v;
      }
    }));
  }

  function toggleCommentBody(index: number) {
    setCommentBodyVisible(commentBodyVisible?.map((v, i) => {
      if (i === index) {
        return !v;
      } else {
        return v;
      }
    }));
  }

  function toggleChildCommentBody(rowIndex: number, columnIndex: number) {
    setChildCommentBodyVisible(new Map(childCommentBodyVisible.set(rowIndex, childCommentBodyVisible.get(rowIndex).map((v, i) => {
      if (i === columnIndex) {
        return !v;
      } else {
        return v;
      }
    }))));
  }

  function formateDate(d: Date) {
    return (new Date(d)).toLocaleDateString('zh-Hans-CN');
  }

  const queryClient = useQueryClient();
  const createCommentMutation = useMutation({
    mutationFn: (data: IComment) => {
      return commentService.create(data);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ['comments', 'list', id]
      });
    },
  });

  async function postComment(commentContent: string, parentComment?: string) {
    try {
      await createCommentMutation.mutateAsync({ author: session?.user.id, blog: id, parentComment, content: commentContent });
    } catch (error: any) {
      alertService.error(error);
    }
  }

  const createVoteMutation = useMutation({
    mutationFn: (data: IVote) => {
      return voteService.create(data);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ['comments', 'list', id]
      });
    },
  });

  async function postVote(commentId: string, vote: Vote) {
    try {
      await createVoteMutation.mutateAsync({ user: session?.user.id, comment: commentId, vote });
    } catch (error: any) {
      alertService.error(error);
    }
  }

  return (
    <div className="content box">
      <p className="title is-4 pb-4" style={{ borderBottom: "2px solid #eee" }}>
        <span className="mr-4">{comments?.pages.map(p => p.data.length).reduce((prev, curr) => prev + curr, 0)}</span>
        Comments
      </p>
      <article className="media">
        <figure className="media-left">
          <span className="icon" style={{ height: '64px', width: '64px' }}>
            <i className="fa-solid fa-user-pen fa-3x"></i>
          </span>
        </figure>
        <div className="media-content">
          <div className="field">
            <div className="control" style={{ position: 'relative' }}>
              <CommentBox onPostComment={postComment} />
            </div>
          </div>
        </div>
      </article>
      <div className="tabs is-right has-text-weight-bold">
        <ul>
          <li className={`${sortFieldName === 'upvoteCount' ? 'is-active' : ''}`}
            onClick={() => sortBy('upvoteCount', 'desc')}>
              <a>Best</a>
          </li>
          <li className={`${sortFieldName === 'createdAt' && sortOrder === 'desc' ? 'is-active' : ''}`}
            onClick={() => sortBy('createdAt', 'desc')}>
              <a>Newest</a>
          </li>
          <li className={`${sortFieldName === 'createdAt' && sortOrder === 'asc' ? 'is-active' : ''}`}
            onClick={() => sortBy('createdAt','asc')}>
              <a>Oldest</a>
          </li>
        </ul>
      </div>
      {
        isPending && (
          <article className="media">
            <figure className="media-left">
              <p className="image is-64x64 is-skeleton">
                <img src="https://placehold.co/128x128" alt="Placeholder image" />
              </p>
            </figure>
            <div className="media-content">
              <div className="content is-skeleton">
                <p>
                  <strong>John Smith</strong> <small>@johnsmith</small> <small>31m</small>
                  <br />
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor
                </p>
              </div>
              <nav className="level is-mobile">
                <div className="level-left">
                  <a className="level-item"><span className="icon is-small is-skeleton"><i className="fas fa-reply"></i></span></a>
                  <a className="level-item"><span className="icon is-small is-skeleton"><i className="fas fa-retweet"></i></span></a>
                  <a className="level-item"><span className="icon is-small is-skeleton"><i className="fas fa-heart"></i></span></a>
                </div>
              </nav>
            </div>
            <div className="media-right">
              <button aria-label="delete" className="delete is-skeleton"></button>
            </div>
          </article>
        )
      }
      {
        isError && (
          <article className="message is-danger">
            <div className="message-body">
              Error loading comment: {error.message}
            </div>
          </article>
        )
      }
      {
        comments?.pages.length === 0 && (
          <div className="text-center">
            No Comments To Display
          </div>
        )
      }
      {
        comments?.pages.map((p, index) =>
          <React.Fragment key={index}>
            {
              p.data.map((comment, i) =>
                <article className="media" key={comment.id}>
                  <figure className="media-left">
                    <span className="icon" style={{ height: '64px', width: '64px' }}>
                      <i className="fa-solid fa-user-pen fa-3x"></i>
                    </span>
                  </figure>
                  <div className="media-content">
                    <div className="content">
                      <div>
                        <span className="author-fullname title is-5 has-text-grey-light">
                          {comment.author.lastName + ' ' + comment.author.firstName}
                        </span>
                        <span className="published-date title is-6 has-text-weight-light ml-4">
                          <time>{(new Date(comment.createdAt)).toLocaleDateString('zh-Hans-CN')}</time>
                        </span>
                        <div className="buttons is-pulled-right">
                          <button className="button is-white" onClick={() => toggleCommentBody(i)}>
                            <span className="icon">
                              <i className={classNames({
                                "fa-solid": true,
                                "fa-minus": commentBodyVisible[i],
                                "fa-plus": !commentBodyVisible[i],
                              })}
                              ></i>
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className={classNames({
                        "is-hidden": !commentBodyVisible[i]
                      })}>
                        {comment.content}
                      </div>
                      <div className="buttons are-small">
                        <div className={classNames({
                          "dropdown is-up": true,
                          "is-hoverable": comment.upvotes.length > 0
                        })}>
                          <div className="dropdown-trigger">
                            <button className="button is-white" onClick={() => postVote(comment.id, Vote.Upvote)}>
                              <span className="icon">
                                <i className="fa-regular fa-thumbs-up"></i>
                              </span>
                              <span>{comment.upvotes.length}</span>
                            </button>
                          </div>
                          <div className="dropdown-menu" role="menu">
                            <div className="dropdown-content">
                              {comment.upvotes.map((v) => (
                                <div className="dropdown-item" key={v.id}>
                                  <span className="icon mr-4" style={{ height: '36px', width: '36px' }}>
                                    <i className="fa-solid fa-user-pen fa-2x"></i>
                                  </span>
                                  <span className="author-fullname title is-5 has-text-grey-light">{v.user.firstName + ' ' + v.user.lastName}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className={classNames({
                          "dropdown is-up": true,
                          "is-hoverable": comment.downvotes.length > 0
                        })}>
                          <div className="dropdown-trigger">
                            <button className="button is-white" onClick={() => postVote(comment.id, Vote.Downvote)}>
                              <span className="icon">
                                <i className="fa-regular fa-thumbs-down"></i>
                              </span>
                              <span>{comment.downvotes.length}</span>
                            </button>
                          </div>
                          <div className="dropdown-menu" role="menu">
                            <div className="dropdown-content">
                              {comment.downvotes.map((v) => (
                                <div className="dropdown-item" key={v.id}>
                                  <span className="icon mr-4" style={{ height: '36px', width: '36px' }}>
                                    <i className="fa-solid fa-user-pen fa-2x"></i>
                                  </span>
                                  <span className="author-fullname title is-5 has-text-grey-light">{v.user.firstName + ' ' + v.user.lastName}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <button className="button is-white" onClick={() => showBox(i)}>Reply</button>
                      </div>
                      {boxVisible && boxVisible[i] && (
                        <div style={{ position: 'relative' }}>
                          <CommentBox onPostComment={postComment} parentComment={comment.id} />
                        </div>
                      )
                      }
                    </div>
                    {comment?.children?.map((childComment, j) => (
                      <article
                        className={classNames({
                          "media": true,
                          "is-hidden": !commentBodyVisible[i]
                        })}
                        key={childComment.id}>
                        <figure className="media-left">
                          <span className="icon" style={{ height: '64px', width: '64px' }}>
                            <i className="fa-solid fa-user-pen fa-3x"></i>
                          </span>
                        </figure>
                        <div className="media-content">
                          <div className="content">
                            <div>
                              <span className="author-fullname title is-5 has-text-grey-light">
                                {childComment.author.lastName + ' ' + childComment.author.firstName}
                              </span>
                              <span className="published-date title is-6 has-text-weight-light ml-4">
                                <time>{(new Date(childComment.createdAt)).toLocaleDateString('zh-Hans-CN')}</time>
                              </span>
                              <div className="buttons is-pulled-right">
                                <button className="button is-white" onClick={() => toggleChildCommentBody(i, j)}>
                                  <span className="icon">
                                    <i className={classNames({
                                      "fa-solid": true,
                                      "fa-minus": childCommentBodyVisible?.get(i) && childCommentBodyVisible?.get(i)[j],
                                      "fa-plus": childCommentBodyVisible?.get(i) && !childCommentBodyVisible?.get(i)[j],
                                    })}
                                    ></i>
                                  </span>
                                </button>
                              </div>
                            </div>
                            <div className={classNames({
                              "is-hidden": childCommentBodyVisible?.get(i) && !childCommentBodyVisible?.get(i)[j]
                            })}>
                              {childComment.content}
                            </div>
                            <div className={classNames({
                              "buttons are-small": true,
                              "is-hidden": childCommentBodyVisible?.get(i) && !childCommentBodyVisible?.get(i)[j]
                            })}>
                              <div className={classNames({
                                "dropdown is-up": true,
                                "is-hoverable": childComment.upvotes.length > 0
                              })}>
                                <div className="dropdown-trigger">
                                  <button className="button is-white" onClick={() => postVote(childComment.id, Vote.Upvote)}>
                                    <span className="icon">
                                      <i className="fa-regular fa-thumbs-up"></i>
                                    </span>
                                    <span>{childComment.upvotes.length}</span>
                                  </button>
                                </div>
                                <div className="dropdown-menu" role="menu">
                                  <div className="dropdown-content">
                                    {childComment.upvotes.map((v) => (
                                      <div className="dropdown-item" key={v.id}>
                                        <span className="icon mr-4" style={{ height: '36px', width: '36px' }}>
                                          <i className="fa-solid fa-user-pen fa-2x"></i>
                                        </span>
                                        <span className="author-fullname title is-5 has-text-grey-light">{v.user.firstName + ' ' + v.user.lastName}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className={classNames({
                                "dropdown is-up": true,
                                "is-hoverable": childComment.downvotes.length > 0
                              })}>
                                <div className="dropdown-trigger">
                                  <button className="button is-white" onClick={() => postVote(childComment.id, Vote.Downvote)}>
                                    <span className="icon">
                                      <i className="fa-regular fa-thumbs-down"></i>
                                    </span>
                                    <span>{childComment.downvotes.length}</span>
                                  </button>
                                </div>
                                <div className="dropdown-menu" role="menu">
                                  <div className="dropdown-content">
                                    {childComment.downvotes.map((v) => (
                                      <div className="dropdown-item" key={v.id}>
                                        <span className="icon mr-4" style={{ height: '36px', width: '36px' }}>
                                          <i className="fa-solid fa-user-pen fa-2x"></i>
                                        </span>
                                        <span className="author-fullname title is-5 has-text-grey-light">{v.user.firstName + ' ' + v.user.lastName}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </article>
              )
            }
          </React.Fragment>
        )
      }

      <button
        className={`button is-medium is-fullwidth has-text-dark ${!hasNextPage ? 'is-hidden' : ''}`}
        disabled={isFetchingNextPage}
        onClick={() => fetchNextPage()}
      >
        {isFetchingNextPage && 'Loading more ...'}
        {!isFetchingNextPage && hasNextPage && 'Load more comments'}
      </button>
    </div >
  );

}
