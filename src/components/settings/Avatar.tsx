import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { accountSettingsStore, sessionStore } from '../../stores'
import { getAvatarFromWNFS } from '../../lib/account-settings'

let imagesFetched = false;

const Avatar = ({ size = 'large' }) => {
  const accountSettings = useRecoilValue(accountSettingsStore)
  const session = useRecoilValue(sessionStore)

  const sizeClasses =
    size === "large"
      ? "w-[88px] h-[88px] text-[40px]"
      : "w-[40px] h-[40px] text-sm";

  const loaderSizeClasses =
    size === "large" ? "w-[28px] h-[28px]" : "w-[16px] h-[16px]";

  const useMountEffect = () =>
    useEffect(() => {
      if (!imagesFetched) {
        getAvatarFromWNFS();
        imagesFetched = true;
      }
    }, []);

  useMountEffect();

  return (
    <>
      {accountSettings.avatar ? (
        <>
          {accountSettings.loading ? (
            <div
              className={`flex items-center justify-center object-cover rounded-full border-2 border-base-content ${sizeClasses}`}
            >
              <span
                className={`animate-spin ease-linear rounded-full border-2 border-t-2 border-t-orange-500 border-base-content ${loaderSizeClasses}`}
              />
            </div>
          ) : (
            <img
              className={`object-cover rounded-full border-2 border-base-content ${sizeClasses}`}
              src={accountSettings.avatar.src}
              alt="User Avatar"
            />
          )}
        </>
      ) : (
        <div
          className={`flex items-center justify-center bg-base-content text-base-100 uppercase font-bold rounded-full ${sizeClasses}`}
        >
          {session.username.trimmed[0]}
        </div>
      )}
    </>
  );
}

export default Avatar;
