import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { appName } from '../../../lib/app-info'
import {
  isUsernameValid,
  isUsernameAvailable,
  register
} from '../../../lib/auth/account'
import CheckIcon from '../../icons/CheckIcon'
import XIcon from '../../icons/XIcon'
import FilesystemActivity from '../../common/FilesystemActivity'

const Register = () => {
  const [initializingFilesystem, setInitializingFilesystem] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(true);
  const [username, setUsername] = useState('')
  const [usernameValid, setUsernameValid] = useState(true);
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [checkingUsername, setCheckingUsername] = useState(false)

  const [buttonDisabled, setButtonDisabled] = useState(
    username.length === 0 || !usernameValid || !usernameAvailable || checkingUsername
  );

  const handleCheckUsername = async (
    event: FormEvent<HTMLInputElement>
  ) => {
    const { value } = event.target as HTMLInputElement;

    setUsername(value);
    setCheckingUsername(true);

    const usernameValidLocal = await isUsernameValid(username);
    setUsernameValid(usernameValidLocal)

    if (usernameValidLocal) {
      const usernameAvailableLocal = await isUsernameAvailable(username);
      setUsernameAvailable(usernameAvailableLocal)
    }

    setCheckingUsername(false);
  };

  const handleRegisterUser = async () => {
    if (checkingUsername) {
      return;
    }

    setInitializingFilesystem(true);

    const registrationSuccessLocal = await register(username)
    setRegistrationSuccess(registrationSuccessLocal);

    if (!registrationSuccessLocal) setInitializingFilesystem(false);
  }

  useEffect(() => {
    setButtonDisabled(
      username.length === 0 ||
        !usernameValid ||
        !usernameAvailable ||
        checkingUsername
    );
  }, [username, usernameValid, usernameAvailable, checkingUsername]);

  if (initializingFilesystem) {
    return <FilesystemActivity activity="Initializing" />;
  }

  return (
    <>
      <input
        type="checkbox"
        id="register-modal"
        defaultChecked
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box w-narrowModal relative text-center">
          <Link to="/" className="btn btn-xs btn-circle absolute right-2 top-2">
            ✕
          </Link>

          <div>
            <h3 className="mb-7 text-base">Choose a username</h3>
            <div className="relative">
              <input
                id="registration"
                type="text"
                placeholder="Type here"
                className={`input input-bordered focus:outline-none w-full px-3 block ${
                  username.length !== 0 &&
                  (!usernameValid || !usernameAvailable)
                    ? "input-error"
                    : ""
                }`}
                onInput={handleCheckUsername}
              />
              {checkingUsername && (
                <span className="rounded-lg border-t-2 border-l-2 border-base-content w-4 h-4 block absolute top-4 right-4 animate-spin" />
              )}
              {!(username.length === 0) &&
                usernameAvailable &&
                usernameValid &&
                !checkingUsername && (
                  <span className="w-4 h-4 block absolute top-[17px] right-4">
                    <CheckIcon />
                  </span>
                )}
              {!(username.length === 0) &&
                !checkingUsername &&
                !(usernameAvailable && usernameValid) && (
                  <span className="w-4 h-4 block absolute top-[17px] right-4">
                    <XIcon />
                  </span>
                )}
            </div>

            {!(username.length === 0) && (
              <label htmlFor="registration" className="label mt-1">
                {(() => {
                  if (usernameValid && usernameAvailable) {
                    return (
                      <span className="label-text-alt text-green-700 dark:text-green-500">
                        This username is available.
                      </span>
                    );
                  } else if (!usernameValid) {
                    return (
                      <span className="label-text-alt text-error">
                        This username is invalid.
                      </span>
                    );
                  } else if (!usernameAvailable) {
                    return (
                      <span className="label-text-alt text-error">
                        This username is unavailable.
                      </span>
                    );
                  }
                })()}
              </label>
            )}
            {!registrationSuccess && (
              <label htmlFor="registration" className="label mt-1">
                <span className="label-text-alt text-error text-left">
                  There was an issue registering your account. Please try again.
                </span>
              </label>
            )}

            <div className="text-left mt-3">
              <input
                type="checkbox"
                id="shared-computer"
                className="peer checkbox checkbox-primary border-2 border-base-content hover:border-orange-300 transition-colors duration-250 ease-in-out inline-grid align-bottom"
              />
              {/* Warning when "This is a shared computer" is checked */}
              <label
                htmlFor="shared-computer"
                className="cursor-pointer ml-1 text-sm grid-inline"
              >
                This is a shared computer
              </label>
              <label
                htmlFor="registration"
                className="label mt-1 hidden peer-checked:block"
              >
                <span className="label-text-alt text-error text-left">
                  For security reasons, {appName} doesn&apos;t support shared
                  computers at this time.
                </span>
              </label>
            </div>

            <div className="mt-5">
              <Link className="btn btn-outline" to="/connect">
                Back
              </Link>
              <button
                className="ml-2 btn btn-primary disabled:opacity-50 disabled:border-neutral disabled:text-neutral"
                disabled={buttonDisabled}
                onClick={handleRegisterUser}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
