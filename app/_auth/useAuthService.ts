import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

import { useAlertService } from "_services";


export { useAuthService };
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

interface IAuthService extends IUserStore {
  login: (username: string, password: string) => Promise<void>;
  refresh: () => Promise<void>;
}

function useAuthService(): IAuthService {
  const alertService = useAlertService();

  return {
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
  };
}
