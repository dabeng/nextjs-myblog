import axios from "axios";

import { useAlertService, IUser, IBlog } from "_services";
import type  { IComment } from "./useCommentService";

export { useReactionService, Reaction };
export type { IReaction, IReactionParams };

/* --- Reaction Service React Hook ---
 * It encapsulates client-side logic and handles HTTP communication between the React front-end
 * and the Next.js back-end API for everything related to blogs.
 */

enum Reaction {
  Upvote = 'Upvote',
  Funny = 'Funny',
  Love = 'Love',
  Surprised = 'Surprised',
  Angry = 'Angry',
  Sad = 'Sad',
}

interface IReaction {
  id: string;
  reaction: Reaction;
  user: IUser;
  blog: IBlog;
  createdAt: Date;
  updatedAt: Date;
}

interface IReactionParams {
  blog?: string;
  article?: string;
}

interface IReactionService {
  getAllBySearchParams: (params: IReactionParams) => Promise<[IReaction]>;
  getAll: () => Promise<[IReaction]>;
  getById: (id: string) => Promise<IReaction>;
  create: (reaction: IReaction) => Promise<void>;
  update: (id: string, params: Partial<IReaction>) => Promise<void>;
  delete: (id: string) => Promise<void>;
}

function useReactionService(): IReactionService {
  const alertService = useAlertService();

  return {
    getAllBySearchParams: async (params: IReactionParams) => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/reactions`, {
        params
      });
      return response.data;
    },
    getAll: async () => {
      const response = await axios.get('api/reactions');
      return response.data;
    },
    getById: async (id: string): Promise<IReaction> => {
      try {
        const response = await axios.get(`/api/reactions/${id}`);
        return response.data;
      } catch (error: any) {
        throw error;
      }
    },
    create: async (reaction) => {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/reactions`, reaction);
    },
    update: async (id, params) => {
      await axios.put(`/api/reactions/${id}`, params);
    },
    delete: async id => {
      const response = await axios.delete(`/api/reactions/${id}`);
    }
  };
}
