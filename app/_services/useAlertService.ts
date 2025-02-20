import { create } from "zustand";

export { useAlertService };

// interfaces
interface IAlert {
  type: string;
  message: string;
  showAfterRedirect: boolean;// TODO，看不出有什么用
}

interface IAlertStore {
  alert?: IAlert;
}

interface IAlertService extends IAlertStore {
  success: (message: string, showAfterRedirect?: boolean) => void;
  error: (message: string, showAfterRedirect?: boolean) => void;
  clear: () => void;
}

// alert state store
const alertStore = create<IAlertStore>(() => ({}));

function useAlertService(): IAlertService {
  const { alert } = alertStore();

  return {
    alert,
    success: (message: string, showAfterRedirect = false) => {
      const type = "alert-success";
      alertStore.setState({
        alert: { type, message, showAfterRedirect }
      });
    },
    error: (message: string, showAfterRedirect = false) => {
      const type = "alert-danger";
      alertStore.setState({
        alert: { type, message, showAfterRedirect }
      });
    },
    clear: () => {
      alertStore.setState(state => {
        let alert = state.alert;

        // if showAfterRedirect is true the alert is kept for
        // one route change (e.g. after successful registration)
        if (alert?.showAfterRedirect) {
          alert.showAfterRedirect = false;
        } else {
          alert = undefined;
        }

        return { alert };
      });
    }
  };
}


