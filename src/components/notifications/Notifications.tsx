import { useRecoilValue } from "recoil";
import { animated, Transition } from "react-spring";

import { notificationStore } from '../../stores';
import Notification from './Notification'

const Notifications = () => {
  const notifications = useRecoilValue(notificationStore);

  if (notifications.length) {
    return (
      <div className="fixed z-max right-4 bottom-8 flex flex-col justify-center">
        <Transition
          items={notifications}
          from={{ opacity: 0 }}
          enter={{ opacity: 1 }}
          leave={{ opacity: 0 }}
        >
          {(styles, notification) =>
            notification && (
              <animated.div style={styles}>
                <Notification notification={notification} />
              </animated.div>
            )
          }
        </Transition>
      </div>
    );
  }

  return null;
};

export default Notifications;
