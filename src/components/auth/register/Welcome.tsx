import { useContext } from 'react';

import { appName } from '../../../lib/app-info'
import SessionContext from '../../../contexts/SessionContext';
import WelcomeCheckIcon from '../../icons/WelcomeCheckIcon'

const Welcome = () => {
  const { session } = useContext(SessionContext);

  return (
    <>
      <input type="checkbox" id="link-device-modal" defaultChecked className="modal-toggle" />
      <div className="modal">
        <div
          className="modal-box w-80 relative text-center dark:border-slate-600 dark:border"
        >
          <div>
            <h3 className="mb-7 text-xl font-serif">
              Welcome, {session.username}!
            </h3>
            <div className="flex justify-center">
              <span>
                <WelcomeCheckIcon />
              </span>
            </div>
            <div>
              <p className="mt-8 mb-4">Your account has been created.</p>

              <div className="mb-8">
                <input type="checkbox" id="password-message" className="peer hidden" />
                <label
                  className="text-primary underline mb-8 hover:cursor-pointer peer-checked:hidden"
                  htmlFor="password-message"
                >
                  Wait&mdash;what's my password?
                </label>
                <p className="hidden peer-checked:block">
                  You don't need a password! <br />
                  {appName} uses public key cryptography to authenticate you with this
                  device.
                </p>
              </div>

              <a className="btn btn-primary" href="/backup">Continue</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome;
