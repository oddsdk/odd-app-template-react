import { useRecoilValue } from "recoil";

import { notificationStore } from '../../stores';
// import { type Notification } from '../../lib/notifications';
import Notification from './Notification'

const Notifications = () => {
  const notifications = useRecoilValue(notificationStore);

  if (notifications.length) {
    return (
      <div className="fixed z-50 right-6 bottom-6 flex flex-col justify-center">
        {notifications.map((notification, index) => (
          <div key={index}>
            {/* @ts-ignore */}
            <Notification notification={notification} />
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default Notifications;
