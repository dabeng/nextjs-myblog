import axios from "axios";

import { IUser } from "_services";
import type  { IComment } from "_services";

export { useVoteService, Vote };
export type { IVote, IVoteSearchParams };

/* --- Vote Service React Hook ---
 * It encapsulates client-side logic and handles HTTP communication between the React front-end
 * and the Next.js back-end API for everything related to blogs.
 */

enum Vote {
  Upvote = 'Upvote',
  Downvote = 'Funny',
}

interface IVote {
  id: string;
  user: IUser;
  comment: IComment;
  vote: Vote;
  createdAt: Date;
  updatedAt: Date;
}

interface IVoteSearchParams {
  user?: string;
  comment?: string;
}

interface IVoteService {
  getBySearchParams: (params: IVoteSearchParams) => Promise<[IVote]>;
  getAll: () => Promise<[IVote]>;
  getById: (id: string) => Promise<IVote>;
  create: (reaction: IVote) => Promise<void>;
  update: (id: string, params: Partial<IVote>) => Promise<void>;
  delete: (id: string) => Promise<void>;
}

function useVoteService(): IVoteService {
  return {
    getBySearchParams: async (params: IVoteSearchParams) => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/votes`, {
        params
      });
      return response.data;
    },
    getAll: async () => {
      const response = await axios.get('api/votes');
      return response.data;
    },
    getById: async (id: string): Promise<IVote> => {
      try {
        const response = await axios.get(`/api/votes/${id}`);
        return response.data;
      } catch (error: any) {
        throw error;
      }
    },
    create: async (vote) => {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/votes`, vote);
    },
    update: async (id, params) => {
      await axios.put(`/api/votes/${id}`, params);
    },
    delete: async id => {
      const response = await axios.delete(`/api/votes/${id}`);
    }
  };
}
