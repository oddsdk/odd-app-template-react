import { createContext, useState, type ReactNode } from "react";

export type Notification = {
  id?: string;
  msg?: string;
  type?: NotificationType;
  timeout?: number;
};

export type NotificationType = "success" | "error" | "info" | "warning";

// Create Notification Context
const NotificationsContext = createContext({
  notifications: [],
  updateNotifications: (notifications: Notification[]) => {},
});

export default NotificationsContext;

// Create Notification Provider
export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState([] as Notification[]);

  const updateNotifications = (updatedNotifications: Notification[]): void => {
    setNotifications([...notifications, ...updatedNotifications]);
  };

  return (
    // @ts-ignore
    <NotificationsContext.Provider value={{ notifications, updateNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
}
