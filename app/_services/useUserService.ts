import axios from "axios";
import { useRouter } from "next/navigation";

import { useAlertService } from "_services";
import { useFetch } from "_helpers/client";

export { useUserService };
export type { IUser };

/* --- User Service React Hook ---
 * It encapsulates client-side logic and handles HTTP communication between the React front-end
 * and the Next.js back-end API for everything related to users.
 */
interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  role: string;
}
interface IUserService {
  register: (user: IUser) => Promise<void>;
  getAll: () => Promise<[IUser]>;
  getById: (id: string) => Promise<IUser | null>;
  create: (user: IUser) => Promise<void>;
  update: (id: string, params: Partial<IUser>) => Promise<void>;
  delete: (id: string) => Promise<void>;
}

function useUserService(): IUserService {
  const alertService = useAlertService();
  const fetch = useFetch();
  const router = useRouter();

  return {
    register: async user => {
      try {
        await fetch.post("/api/account/register", user);
        alertService.success("Registration successful", true);
        router.push("/account/login");
      } catch (error: any) {
        alertService.error(error);
      }
    },
    getAll: async () => {
      const response = await axios.get("/api/users");
      return response.data;
    },
    getById: async (id: string): Promise<IUser | null> => {
      try {
        const response = await axios.get(`/api/users/${id}`);
        return response.data;
      } catch (error: any) {
        alertService.error(error);
        return null;
      }
    },
    create: user => {
      return axios.post('/api/users', user);
    },
    update: async (id, params) => {
      await axios.put(`/api/users/${id}`, params);
    },
    delete: async id => {
      // delete user
      const response = await axios.delete(`/api/users/${id}`);

      // logout if the user deleted their own record
      if (response.data.deletedSelf) {
        router.push("/account/login");
      }
    }
  };
}
