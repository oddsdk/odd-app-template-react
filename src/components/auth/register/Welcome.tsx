import { useRecoilValue } from "recoil";
import { Link } from "react-router-dom";

import { appName } from '../../../lib/app-info';
import { sessionStore } from '../../../stores';
import WelcomeCheckIcon from '../../icons/WelcomeCheckIcon'

const Welcome = () => {
  const session = useRecoilValue(sessionStore);

  return (
    <>
      <input
        type="checkbox"
        id="link-device-modal"
        defaultChecked
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box w-narrowModal relative text-center">
          <div>
            <h3 className="mb-14 text-base">Welcome, {session.username.trimmed}!</h3>
            <div className="flex justify-center mb-11 text-base-content">
              <WelcomeCheckIcon />
            </div>
            <div>
              <p className="mb-4 text-left">Your account has been created.</p>

              <div className="mb-8 text-left">
                <input
                  type="checkbox"
                  id="password-message"
                  className="peer hidden"
                />
                <label
                  className="text-blue-500 underline mb-8 hover:cursor-pointer peer-checked:hidden"
                  htmlFor="password-message"
                >
                  Wait&mdash;what&#39;s my password?
                </label>
                <p className="hidden peer-checked:block">
                  You don&#39;t need a password! <br />
                  {appName} uses public key cryptography to authenticate you
                  with this device.
                </p>
              </div>

              <Link className="btn btn-primary" to="/backup">
                Continue
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome;
