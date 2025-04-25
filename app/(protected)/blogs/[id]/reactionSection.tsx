"use client";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Spinner } from "_components";
import { useReactionService, Reaction } from "_services";
import type { IReaction } from "_services";

import styles from "./styles.module.css";
import { Interface } from "readline";
import { string } from "zod";
/*
The blog page renders the add/edit user component with the specified user so the component
* is set to "edit" mode.
*/
export default function ReactionSection() {
  const {data: session} = useSession();
  const { id } = useParams<{ id: string }>();
  const reactionService = useReactionService();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['reactions', 'list', id],
    queryFn: () => reactionService.getAllBySearchParams({ blog: id })
  });

  const reactionData = Object.entries(Reaction).map(([key, value]) => {
    let item = { key, caption: value, count: data?.filter(item => item.reaction === key).length, icon: '' };
    switch (key) {
      case Reaction.Upvote:
        item.icon = 'fa-thumbs-up';
        break;
      case Reaction.Funny:
        item.icon = 'fa-face-laugh-squint';
        break;
      case Reaction.Love:
        item.icon = 'fa-face-kiss-wink-heart';
        break;
      case Reaction.Surprised:
        item.icon = 'fa-face-surprise';
        break;
      case Reaction.Angry:
        item.icon = 'fa-face-angry';
        break;
      case Reaction.Sad:
        item.icon = 'fa-face-sad-tear';
        break;
    }
    return item;
  });

  const queryClient = useQueryClient();
  const createReactionMutation = useMutation({
    mutationFn: (data: IReaction) => {
      return reactionService.create(data);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ['reactions', 'list']
      });
    },
  });

  async function submitReaction(reaction: string) {
    await createReactionMutation.mutateAsync({reaction, user: session?.user.id, blog: id } as any);
  }

  if (isPending) return <div style={{ "height": "330px", "fontSize": "64px" }}><Spinner /></div>;

  if (isError) return (
    <article className="message is-danger">
      <div className="message-body">
        Error loading reactions: {error.message}
      </div>
    </article>
  );

  return (
    <div className="content box">
      <p className="title is-2">Comments</p>
      <p className="title is-4 has-text-centered">What do you think?</p>
      <p className="title is-5 has-text-centered">10 Responses</p>
      <nav className="level is-mobile">
        {reactionData.map(r => (
          <div key={r.caption} className="level-item has-text-centered">
            <div className={styles['reaction-item']} onClick={() => submitReaction(r.key)}>
              <p className="heading">
                <span className="icon">
                  <i className={`fa-regular fa-3x ${r.icon}`}></i>
                </span>
              </p>
              <p className={`title is-5 ${styles['reaction-number']}`}>{r.count}</p>
              <p className={`title is-6 ${styles['reaction-enum']}`}>{r.caption}</p>
            </div>
          </div>
        ))}
      </nav>
    </div>
  );

}
