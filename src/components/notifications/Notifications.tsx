import { useContext  } from 'react';

import NotificationsContext from '../../contexts/NotificationsContext';
import Notification from './Notification'

const Notifications = () => {
  const { notifications } = useContext(NotificationsContext);

  if (notifications.length) {
    return (
      <div className="fixed z-50 right-6 bottom-6 flex flex-col justify-center">
        {notifications.map((notification, index) => (
          <div key={index}>
            <Notification notification={notification} />
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default Notifications;
