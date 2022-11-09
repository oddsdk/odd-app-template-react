import { useRecoilValue } from "recoil";

import { themeStore } from "../../stores";
import { THEME } from "../../lib/theme";
import type { Notification } from "../../lib/notifications";
import CheckThinIcon from "../icons/CheckThinIcon";
import InfoThinIcon from "../icons/InfoThinIcon";
import WarningThinIcon from "../icons/WarningThinIcon";
import XThinIcon from "../icons/XThinIcon";

type Props = {
  notification: Notification;
};

const NotificationComp = ({ notification }: Props) => {
  const theme = useRecoilValue(themeStore);

  if (!notification?.type) {
    return null;
  }

  const iconMap = {
    info: {
      component: InfoThinIcon,
      props: {
        color: "#1e3a8a",
      },
    },
    error: {
      component: XThinIcon,
      props: {
        color: theme === THEME.LIGHT ? "#ffd6d7" : "#fec3c3",
      },
    },
    success: {
      component: CheckThinIcon,
      props: {
        color: "#14532D",
      },
    },
    warning: {
      component: WarningThinIcon,
      props: {
        color: "#7c2d12",
      },
    },
  };

  const IconComponent = iconMap[notification.type].component;

  return (
    <div
      className="animate-fadeInUp"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div
        className={`alert alert-${notification.type} text-sm mb-3 peer-last:mb-0`}
      >
        <div>
          <IconComponent {...iconMap[notification.type].props} />
          <span className="pl-1">{notification.msg}</span>
        </div>
      </div>
    </div>
  );
};

export default NotificationComp;
