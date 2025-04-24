"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Spinner, ForwardRefEditor } from "_components";
import { useBlogService, IBlog } from "_services";
import { isErrored } from "stream";

import styles from "./styles.module.css";
/*
The blog page renders the add/edit user component with the specified user so the component
* is set to "edit" mode.
*/
export default function ReactionSection() {
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
    <div className="content box">
      <p className="title is-2">Comments</p>
      <p className="title is-4 has-text-centered">What do you think?</p>
      <p className="title is-5 has-text-centered">10 Responses</p>
      <nav className="level is-mobile">
        <div className="level-item has-text-centered">
          <div className={styles['reaction-item']}>
            <p className="heading">
              <span className="icon">
                <i className="fa-regular fa-thumbs-up fa-3x"></i>
              </span>
            </p>
            <p className={`title is-5 ${styles['reaction-number']}`}>0</p>
            <p className={`title is-6 ${styles['reaction-enum']}`}>Upvote</p>
          </div>
        </div>
        <div className="level-item has-text-centered">
          <div>
            <p className="heading">
              <span className="icon">
                <i className="fa-regular fa-face-laugh-squint fa-3x"></i>
              </span></p>
            <p className="subtitle">Funny</p>
          </div>
        </div>
        <div className="level-item has-text-centered">
          <div>
            <p className="heading">
              <span className="icon">
                <i className="fa-regular fa-face-kiss-wink-heart fa-3x"></i>
              </span></p>
            <p className="subtitle">Love</p>
          </div>
        </div>
        <div className="level-item has-text-centered">
          <div>
            <p className="heading">
              <span className="icon">
                <i className="fa-regular fa-face-surprise fa-3x"></i>
              </span></p>
            <p className="subtitle">Surprise</p>
          </div>
        </div>
        <div className="level-item has-text-centered">
          <div>
            <p className="heading">
              <span className="icon is-large">
                <i className="fa-regular fa-face-angry fa-3x"></i>
              </span></p>
            <p className="subtitle">Angry</p>
          </div>
        </div>
        <div className="level-item has-text-centered">
          <div>
            <p className="heading">
              <span className="icon">
                <i className="fa-regular fa-face-sad-tear fa-3x"></i>
              </span></p>
            <p className="subtitle">Sad</p>
          </div>
        </div>
      </nav>
    </div>
  );

}
