import { type Notification, NotificationType } from '../contexts/NotificationsContext';

type RemoveProps = {
  id: string;
  notifications: Notification[];
  updateNotifications: (notifications: Notification[]) => void;
};
export const removeNotification: (params: RemoveProps) => void = ({ id, notifications, updateNotifications }) => {
  updateNotifications(
    notifications.filter((notification) => notification.id !== id)
  );
};

type AddProps = {
  notification: {
    msg: string;
    type?: NotificationType;
    timeout?: number;
  };
  notifications: Notification[];
  updateNotifications: (notifications: Notification[]) => void;
};
export const addNotification: (params: AddProps) => void = ({ notification, notifications, updateNotifications }) => {
  const { msg, type = 'info', timeout = 5000 } = notification;

  // uuid for each notification
  const id = crypto.randomUUID();

  // adding new notifications to the bottom of the list so they stack from bottom to top
  updateNotifications([
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
    removeNotification({ id, notifications, updateNotifications });
    clearTimeout(timer);
  }, timeout);

  // return the id
  return id;
};
