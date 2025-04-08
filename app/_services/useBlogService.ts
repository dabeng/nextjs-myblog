import axios from "axios";

import { useAlertService, IUser } from "_services";
import type  { IComment } from "./useCommentService";

export { useBlogService };
export type { IBlog };

/* --- Blog Service React Hook ---
 * It encapsulates client-side logic and handles HTTP communication between the React front-end
 * and the Next.js back-end API for everything related to blogs.
 */

interface IBlog {
  id: string;
  author: IUser;
  title: string;
  subtitle: string;
  content: string;
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

interface IBlogService {
  getAllByAuthor: (authorId: string) => Promise<[IBlog]>;
  getAll: () => Promise<[IBlog]>;
  getById: (id: string) => Promise<IBlog | null>;
  create: (user: IBlog) => Promise<void>;
  update: (id: string, params: Partial<IBlog>) => Promise<void>;
  delete: (id: string) => Promise<void>;
}

function useBlogService(): IBlogService {
  const alertService = useAlertService();

  return {
    getAllByAuthor: async (authorId: string) => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs`, {
        params: {authorId}
      });
      return response.data;
    },
    getAll: async () => {
      const response = await axios.get('api/blogs');
      return response.data;
    },
    getById: async (id: string): Promise<IBlog | null> => {
      try {
        const response = await axios.get(`/api/blogs/${id}`);
        return response.data;
      } catch (error: any) {
        alertService.error(error);
        return null;
      }
    },
    create: blog => {
      return axios.post('/api/blogs', blog);
    },
    update: async (id, params) => {
      await axios.put(`/api/blogs/${id}`, params);
    },
    delete: async id => {
      const response = await axios.delete(`/api/blogs/${id}`);
    }
  };
}
