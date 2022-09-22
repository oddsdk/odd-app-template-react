import { FormEvent, useContext, useState } from "react";
import { appName } from '../../../lib/app-info'
import {
  isUsernameValid,
  isUsernameAvailable,
  register
} from '../../../lib/auth/account'
import FilesystemContext from "../../../contexts/FilesystemContext";
import SessionContext from "../../../contexts/SessionContext";
import CheckIcon from '../../icons/CheckIcon'
import XIcon from '../../icons/XIcon'
import FilesystemActivity from '../../common/FilesystemActivity'

let username: string = ''
let usernameValid = true
let usernameAvailable = true
let registrationSuccess = true
let checkingUsername = false

let initializingFilesystem = false

const Register = () => {
  const { session, updateSession } = useContext(SessionContext);
  const { updateFilesystem } = useContext(FilesystemContext);
  const [buttonDisabled, setButtonDisabled] = useState(
    username.length === 0 || !usernameValid || !usernameAvailable
  );

  const handleCheckUsername = async (
    event: FormEvent<HTMLInputElement>
  ) => {
    const { value } = event.target as HTMLInputElement;

    username = value;
    checkingUsername = true;

    usernameValid = await isUsernameValid(username);

    if (usernameValid) {
      usernameAvailable = await isUsernameAvailable(username);
    }
    checkingUsername = false;

    setButtonDisabled(
      username.length === 0 || !usernameValid || !usernameAvailable
    );
  };

  const handleRegisterUser = async () => {
    initializingFilesystem = true

    registrationSuccess = await register(username, session, updateSession, updateFilesystem)

    if (!registrationSuccess) initializingFilesystem = false
  }

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
        <div className="modal-box w-80 relative text-center dark:border-slate-600 dark:border">
          <a
            href="/"
            className="btn btn-xs btn-circle absolute right-2 top-2 dark:bg-slate-600"
          >
            ✕
          </a>

          <div>
            <h3 className="mb-7 text-xl font-serif">Choose a username</h3>
            <div className="relative">
              <input
                id="registration"
                type="text"
                placeholder="Type here"
                className={`input input-bordered w-full block dark:border-slate-300 ${
                  username.length !== 0 &&
                  (!usernameValid || !usernameAvailable)
                    ? "input-error"
                    : ""
                }`}
                onInput={handleCheckUsername}
              />
              {checkingUsername && (
                <span className="rounded-lg border-t-2 border-l-2 border-slate-600 dark:border-slate-50 w-4 h-4 block absolute top-4 right-4 animate-spin" />
              )}
              {!(username.length === 0) &&
                usernameAvailable &&
                usernameValid &&
                !checkingUsername && (
                  <span className="w-4 h-4 block absolute top-5 right-4">
                    <CheckIcon />
                  </span>
                )}
              {!(username.length === 0) &&
                !checkingUsername &&
                !(usernameAvailable && usernameValid) && (
                  <span className="w-4 h-4 block absolute top-5 right-4">
                    <XIcon />
                  </span>
                )}
            </div>

            {!(username.length === 0) && (
              <label htmlFor="registration" className="label mt-1">
                {(() => {
                  if (usernameValid && usernameAvailable) {
                    return (
                      <span className="label-text-alt text-success">
                        The username is available.
                      </span>
                    );
                  } else if (!usernameValid) {
                    return (
                      <span className="label-text-alt text-error">
                        The username is invalid.
                      </span>
                    );
                  } else if (!usernameAvailable) {
                    return (
                      <span className="label-text-alt text-error">
                        The username is unavailable.
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
                className="peer checkbox checkbox-primary inline-grid align-bottom dark:border-slate-300"
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
                  For security reasons, {appName} doesn't support shared
                  computers at this time.
                </span>
              </label>
            </div>

            <div className="mt-5">
              <a className="btn btn-primary btn-outline" href="/connect">
                Back
              </a>
              <button
                className="ml-2 btn btn-primary"
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
