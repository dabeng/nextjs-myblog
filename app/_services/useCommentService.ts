import axios from "axios";

import { useAlertService, IVote } from "_services";

export { useCommentService };
export type { IComment, ICommentOnePageParams };

/* --- Comment Service React Hook ---
 * It encapsulates client-side logic and handles HTTP communication between the React front-end
 * and the Next.js back-end API for everything related to blogs.
 */


interface IComment {
  id: string;
  author: string;
  blog: string;
  content: string;
  upvotes: [IVote];
  downvotes: [IVote];
  parentComment?: string;
  createdAt: Date;
  updatedAt: Date;
  children?: [IComment];
}

interface ICommentOnePageResponse {
  data: [IComment];
  metadata: {
    total: number
  }
}

interface ICommentOnePageParams {
  blog?: string;
  page: number;
  page_size?: number;
  sortFieldName?: string;
  sortOrder?: 'asc' | 'desc';
}

interface ICommentService {
  getAll: () => Promise<[IComment]>;
  getOnePage: (params: ICommentOnePageParams) => Promise<ICommentOnePageResponse>;
  getById: (id: string) => Promise<IComment>;
  create: (user: IComment) => Promise<void>;
  update: (id: string, params: Partial<IComment>) => Promise<void>;
  delete: (id: string) => Promise<void>;
}

function useCommentService(): ICommentService {
  const alertService = useAlertService();

  return {
    getAll: async () => {
      const response = await axios.get('api/comments');
      return response.data;
    },
    getOnePage: async (params: ICommentOnePageParams): Promise<ICommentOnePageResponse> => {
      try {
        const response = await axios.get(`/api/comments`, {
          params: params
        });
        return response.data;
      } catch (error: any) {
        throw error;
      }
    },
    getById: async (id: string): Promise<IComment> => {
      try {
        const response = await axios.get(`/api/comments/${id}`);
        return response.data;
      } catch (error: any) {
        throw error;
      }
    },
    create: comment => {
      return axios.post('/api/comments', comment);
    },
    update: async (id, params) => {
      await axios.put(`/api/comments/${id}`, params);
    },
    delete: async id => {
      const response = await axios.delete(`/api/comments/${id}`);
    }
  };
}
