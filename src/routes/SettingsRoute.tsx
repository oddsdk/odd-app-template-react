import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { sessionStore } from "../stores";
import AvatarUpload from "../components/settings/AvatarUpload";
import ConnectedDevices from "../components/settings/ConnectedDevices";
import FullScreenLoader from "../components/common/FullScreenLoader";
import ThemePreferences from "../components/settings/ThemePreferences";
import RecoveryKit from "../components/settings/RecoveryKit";
import Username from "../components/settings/Username";

const SettingsRoute = () => {
  const session = useRecoilValue(sessionStore)

  if (!session.session && !session.loading) {
    return <Navigate to="/" />;
  }

  if (session.loading) {
    return <FullScreenLoader />;
  }

  return (
    <div className="min-h-[calc(100vh-128px)] md:min-h-[calc(100vh-160px)] pt-8 md:pt-16 flex flex-col items-start max-w-[690px] m-auto gap-10 pb-5 text-sm">
      <h1 className="text-xl">Account Settings</h1>

      <div className="flex flex-col items-start justify-center gap-6">
        <AvatarUpload />

        <Username />

        <ThemePreferences />

        <ConnectedDevices />

        <RecoveryKit />
      </div>
    </div>
  );
};

export default SettingsRoute;
