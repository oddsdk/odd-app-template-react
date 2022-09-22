import { useContext } from 'react';

import ThemeContext, { THEME} from '../../contexts/ThemeContext'
import type { Notification } from '../../contexts/NotificationsContext'
import CheckThinIcon from '../icons/CheckThinIcon'
import XThinIcon from '../icons/XThinIcon'

type Props = {
  notification: Notification;
}

const NotificationComp = ({ notification }: Props) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className={`alert alert-${notification.type} text-sm mb-3 peer-last:mb-0`}>
        <div>
          {notification.type === 'success' && (
            <CheckThinIcon
              color={theme === THEME.LIGHT ? '#b8ffd3' : '#002e12'}
            />
          )}
          {notification.type === 'error' && (
            <XThinIcon color={theme === THEME.LIGHT ? '#ffd6d7' : '#fec3c3'} />
          )}
          <span className="pl-1">{notification.msg}</span>
        </div>
      </div>
    </div>
  );
};

export default NotificationComp;
