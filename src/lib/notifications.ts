import { getRecoil, setRecoil } from "recoil-nexus";

import { notificationStore } from "../stores";

export type Notification = {
  id?: string;
  msg?: string;
  type?: NotificationType;
  timeout?: number;
};

export type NotificationType = "success" | "error" | "info" | "warning";

/**
 * Remove a notification from the store using its id
 * @param id
 */
export const removeNotification: (id: string) => void = (id) => {
  const notifications = getRecoil(notificationStore);

  setRecoil(
    notificationStore, notifications.filter(
      (notification: Notification) => notification.id !== id
    )
  );
};

/**
 * Add a new notification to the bottom of the list
 * @param notification
 * @returns id
 */
export const addNotification: (notification: Notification) => void = ({
  msg,
  type = "info",
  timeout = 5000,
}) => {
  const notifications = getRecoil(notificationStore);

  // uuid for each notification
  const id = crypto.randomUUID();

  // adding new notifications to the bottom of the list so they stack from bottom to top
  setRecoil(notificationStore,[
    ...notifications,
    {
      id,
      msg,
      type,
      timeout,
    },
  ]);

  // removing the notification after a specified timeout
  const timer = setTimeout(() => {
    removeNotification(id);
    clearTimeout(timer);
  }, timeout);

  // return the id
  return id;
};
