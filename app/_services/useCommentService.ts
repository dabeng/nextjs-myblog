import axios from "axios";

import { useAlertService } from "_services";

export { useCommentService };
export type { IComment };

/* --- Blog Service React Hook ---
 * It encapsulates client-side logic and handles HTTP communication between the React front-end
 * and the Next.js back-end API for everything related to blogs.
 */

interface IComment {
  id: string;
  author: string;
  content: string;
  blog: string;
  parentComment: string;
}

interface ICommentService {
  getAll: () => Promise<[IComment]>;
  getById: (id: string) => Promise<IComment | null>;
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
    getById: async (id: string): Promise<IComment | null> => {
      try {
        const response = await axios.get(`/api/comments/${id}`);
        return response.data;
      } catch (error: any) {
        alertService.error(error);
        return null;
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
