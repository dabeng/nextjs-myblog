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
    <>
      <p className="has-text-weight-bold has-text-grey-light mt-6 mb-4">
        <span className="is-size-5 mr-4">{`${data.author.lastName} ${data.author.firstName}`}</span>
        {data.updatedAt &&
          <span className="is-size-6 is-pulled-right ml-4">
            UPDATED: {formateDate(data.updatedAt)}
          </span>
        }
        <span className="is-size-6 is-pulled-right">
          PUBLISHED: {formateDate(data.createdAt)}
        </span>
      </p>
      <div className="content box">
        <p className="title is-1">{data.title}</p>
        <ForwardRefEditor markdown={data.content} contentEditableClassName="prose" />
      </div>
      <div className="content box">
        <p className="title is-2">Comments</p>
        <p className="title is-4 has-text-centered">What do you think?</p>
        <p className="title is-5 has-text-centered">10 Responses</p>
        <nav className="level is-mobile">
          <div className="level-item has-text-centered">
            <div>
              <p className="heading">
                <span className="icon">
                  <i className="fa-regular fa-thumbs-up fa-3x"></i>
                </span></p>
              <p className="subtitle">Upvote</p>
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
              <p className="control">
                <textarea className="textarea" placeholder="Add a comment..."></textarea>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <button className="button">Post comment</button>
              </p>
            </div>
          </div>
        </article>
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
      </div>
    </>
  );

}
