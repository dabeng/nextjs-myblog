import { create } from "zustand";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

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
}

interface IUserStore {
  users?: IUser[];
  user?: IUser;
  currentUser?: IUser;
}

interface IUserService extends IUserStore {
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (user: IUser) => Promise<void>;
  getAll: () => Promise<[IUser]>;
  getById: (id: string) => Promise<IUser | null>;
  getCurrent: () => Promise<void>;
  create: (user: IUser) => Promise<void>;
  update: (id: string, params: Partial<IUser>) => Promise<void>;
  delete: (id: string) => Promise<void>;
}

// user state store
const initialState = {
  users: undefined,
  user: undefined,
  currentUser: undefined
};
const userStore = create<IUserStore>(() => initialState);

function useUserService(): IUserService {
  const alertService = useAlertService();
  const fetch = useFetch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { users, user, currentUser } = userStore();

  return {
    users,
    user,
    currentUser,
    login: async (username, password) => {
      alertService.clear(); //TODO: it should be removed
      try {
        const currentUser = await fetch.post("/api/account/login", {
          username,
          password
        });
        userStore.setState({ ...initialState, currentUser }); // TODO, remove initialState

        // get return url from query parameters or default to '/'
        const returnUrl = searchParams.get("returnUrl") || "/";
        router.push(returnUrl);
      } catch (error: any) {
        alertService.error(error);
      }
    },
    logout: async () => {
      await fetch.post("/api/account/logout");
      router.push("/account/login");
    },
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
    getCurrent: async () => {
      if (!currentUser) {
        userStore.setState({
          currentUser: await fetch.get("/api/users/current")
        });
      }
    },
    create: user => {
      return axios.post('/api/users', user);
    },
    update: async (id, params) => {
      await axios.put(`/api/users/${id}`, params);

      // update current user if the user updated their own record
      if (id === currentUser?.id) {
        userStore.setState({
          currentUser: { ...currentUser, ...params }
        });
      }
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
