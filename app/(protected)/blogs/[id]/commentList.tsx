"use client";

import React, { useRef, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Spinner } from "_components";
import { useAlertService, useCommentService, IComment } from "_services";
import { isErrored } from "stream";
import CommentBox from "./commentbox";

import styles from "./styles.module.css";
import { relative } from "path";
import { blogService } from "@/_helpers/server";
/*
The blog page renders the add/edit user component with the specified user so the component
* is set to "edit" mode.
*/
export default function CommentList() {
  const { data: session } = useSession();
  const { id } = useParams<{ id: string }>();
  const alertService = useAlertService();
  const commentService = useCommentService();

  const [page, setPage] = useState(1);
  const { data: comments, isPending, isError, error, status } = useQuery({
    queryKey: ['comments', 'list', id, page],
    queryFn: () => commentService.getOnePage({ author: session?.user.id, blog: id, page })
  });
  const [boxVisible, setBoxVisible] = useState(Array<boolean>);

  useEffect(() => {
    if (status === 'success') {
      setBoxVisible(comments.data.map(c => false));
    }
  }, [status, comments]);
  // if (comments?.data) {
  //   setBoxVisible(comments.data.map(c => false));
  // }
  function showBox(targetIndex: number) {
    setBoxVisible(boxVisible?.map((v, i) => {
      if (i === targetIndex) {
        return !v;
      } else {
        return v;
      }
    }));
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

  return (
    <div className="content box">
      <p className="title is-4">Comments</p>
      <article className="media">
        <figure className="media-left">
          <p className="image is-64x64">
            <img src="https://bulma.io/assets/images/placeholders/128x128.png" />
          </p>
        </figure>
        <div className="media-content">
          <div className="field">
            <div className="control" style={{ position: 'relative' }}>
              <CommentBox onPostComment={postComment} />
            </div>
          </div>
        </div>
      </article >

      {
        isPending && (
          <div style={{ "height": "300px", "fontSize": "64px" }}>
            <Spinner />
          </div>
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
        comments?.data && (comments.data as Array<IComment>).length === 0 && (
          <div className="text-center">
            No Comments To Display
          </div>
        )
      }
      {
        comments?.data.map((comment, i) => (
          <article className="media" key={comment.id}>
            <figure className="media-left">
              <p className="image is-64x64">
                <img src="https://bulma.io/assets/images/placeholders/128x128.png" />
              </p>
            </figure>
            <div className="media-content">
              <div className="content">
                <div>
                  <span className="author-fullname">{comment.author.lastName + ' ' + comment.author.firstName}</span>
                </div>
                <div>
                  {comment.content}
                </div>
                <div className="buttons are-small">
                  <button className="button is-white">
                    <span className="icon">
                      <i className="fa-regular fa-thumbs-up"></i>
                    </span>
                    <span>0</span>
                  </button>
                  <button className="button is-white">
                    <span className="icon">
                      <i className="fa-regular fa-thumbs-down"></i>
                    </span>
                    <span>0</span>
                  </button>
                  <button className="button is-white" onClick={() => showBox(i)}>Reply</button>
                </div>
                {boxVisible && boxVisible[i] && (
                  <div style={{ position: 'relative' }}>
                    <CommentBox onPostComment={postComment} parentComment={comment.id} />
                  </div>
                )
                }
              </div>
              {comment?.children?.map(childComment => (
                <article className="media">
                  <figure className="media-left">
                    <p className="image is-48x48">
                      <img src="https://bulma.io/assets/images/placeholders/96x96.png" />
                    </p>
                  </figure>
                  <div className="media-content">
                    <div className="content">
                      <div>
                        <span className="author-fullname">
                          {childComment.author.lastName + ' ' + childComment.author.firstName}
                        </span>
                      </div>
                      <div>
                        {childComment.content}
                      </div>
                      <div className="buttons are-small">
                        <button className="button is-white">
                          <span className="icon">
                            <i className="fa-regular fa-thumbs-up"></i>
                          </span>
                          <span>0</span>
                        </button>
                        <button className="button is-white">
                          <span className="icon">
                            <i className="fa-regular fa-thumbs-down"></i>
                          </span>
                          <span>0</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </article>
        )
        )
      }

      <article className="media">
        <figure className="media-left">
          <p className="image is-64x64">
            <img src="https://bulma.io/assets/images/placeholders/128x128.png" />
          </p>
        </figure>
        <div className="media-content">
          <div className="content">
            <p>
              <strong>Barbara Middleton</strong>
              <br />
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis porta eros
              lacus, nec ultricies elit blandit non. Suspendisse pellentesque mauris
              sit amet dolor blandit rutrum. Nunc in tempus turpis.
              <br />
              <small><a>Like</a> · <a>Reply</a> · 3 hrs</small>
            </p>
          </div>

          <article className="media">
            <figure className="media-left">
              <p className="image is-48x48">
                <img src="https://bulma.io/assets/images/placeholders/96x96.png" />
              </p>
            </figure>
            <div className="media-content">
              <div className="content">
                <p>
                  <strong>Sean Brown</strong>
                  <br />
                  Donec sollicitudin urna eget eros malesuada sagittis. Pellentesque
                  habitant morbi tristique senectus et netus et malesuada fames ac
                  turpis egestas. Aliquam blandit nisl a nulla sagittis, a lobortis
                  leo feugiat.
                  <br />
                  <small><a>Like</a> · <a>Reply</a> · 2 hrs</small>
                </p>
              </div>
            </div>
          </article>

          <article className="media">
            <figure className="media-left">
              <p className="image is-48x48">
                <img src="https://bulma.io/assets/images/placeholders/96x96.png" />
              </p>
            </figure>
            <div className="media-content">
              <div className="content">
                <p>
                  <strong>Kayli Eunice </strong>
                  <br />
                  Sed convallis scelerisque mauris, non pulvinar nunc mattis vel.
                  Maecenas varius felis sit amet magna vestibulum euismod malesuada
                  cursus libero. Vestibulum ante ipsum primis in faucibus orci luctus
                  et ultrices posuere cubilia Curae; Phasellus lacinia non nisl id
                  feugiat.
                  <br />
                  <small><a>Like</a> · <a>Reply</a> · 2 hrs</small>
                </p>
              </div>
            </div>
          </article>
        </div>
      </article>
    </div >
  );

}
