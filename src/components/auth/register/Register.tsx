import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from 'recoil'

import { sessionStore } from '../../../stores'
import {
  createDID,
  prepareUsername,
  register,
  USERNAME_STORAGE_KEY,
} from "../../../lib/auth/account";
import FilesystemActivity from '../../common/FilesystemActivity'

const Register = () => {
  const {
    program: {
      components: { crypto, storage },
    },
  } = useRecoilValue(sessionStore);
  const [initializingFilesystem, setInitializingFilesystem] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(true);
  const [username, setUsername] = useState('')
  const [encodedUsername, setEncodedUsername] = useState('');
  const [usernameValid] = useState(true);
  const [usernameAvailable] = useState(true);
  const [checkingUsername, setCheckingUsername] = useState(false)
  const [existingAccount, setExistingAccount] = useState(false)

  const [buttonDisabled, setButtonDisabled] = useState(
    username.length === 0 || !usernameValid || !usernameAvailable || checkingUsername
  );

  const handleCheckUsername = async (
    event: FormEvent<HTMLInputElement>
  ) => {
    const { value } = event.target as HTMLInputElement;

    setUsername(value);
    setCheckingUsername(true);

    /**
     * Create a new DID for the user, which will be appended to their username, concatenated
     * via a `#`, hashed and encoded to ensure uniqueness
     */
    const did = await createDID(crypto);
    const fullUsername = `${value}#${did}`;
    await storage.setItem(USERNAME_STORAGE_KEY, fullUsername);

    const encodedUsernameLocal = await prepareUsername(fullUsername);
    setEncodedUsername(encodedUsernameLocal);

    setCheckingUsername(false);
  };

  const handleRegisterUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (checkingUsername) {
      return;
    }

    setInitializingFilesystem(true);

    const registrationSuccessLocal = await register(encodedUsername);
    setRegistrationSuccess(registrationSuccessLocal);

    if (!registrationSuccessLocal) setInitializingFilesystem(false);
  };

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
    <div className="flex flex-col items-center justify-center gap-8 min-h-[calc(100vh-128px)] md:min-h-[calc(100vh-160px)] max-w-[352px] m-auto">
      <h1 className="text-base">Connect this device</h1>
      {/* Registration Form */}
      <form
        onSubmit={handleRegisterUser}
        className="w-full p-6 rounded bg-base-content text-base-100"
      >
        <h2 className="mb-2 text-sm font-semibold">Choose a username</h2>
        <div className="relative">
          <input
            id="registration"
            type="text"
            placeholder="Type here"
            className={`input input-bordered bg-neutral-50 !text-neutral-900 dark:border-neutral-900 rounded-lg focus:outline-none w-full px-3 block ${
              !(username.length === 0) &&
              usernameAvailable &&
              usernameValid &&
              !checkingUsername
                ? "!border-green-300"
                : ""
            } ${
              username.length !== 0 && (!usernameValid || !usernameAvailable)
                ? "!border-red-400"
                : ""
            }`}
            onInput={handleCheckUsername}
          />
          {checkingUsername && (
            <span className="rounded-lg border-t-2 border-l-2 border-base-content w-4 h-4 block absolute top-4 right-4 animate-spin" />
          )}
        </div>

        {!registrationSuccess && (
          // Error when registration fails
          <label htmlFor="registration" className="label">
            <span className="text-xxs !p-0 text-error text-left">
              There was an issue registering your account. Please try again.
            </span>
          </label>
        )}

        <div className="text-left mt-4">
          <input
            type="checkbox"
            id="shared-computer"
            className="peer checkbox checkbox-primary hover:border-base-100 rounded-lg border-2 border-base-100 transition-colors duration-250 ease-in-out inline-grid align-bottom checked:bg-base-100"
          />
          {/* Warning when "This is a shared computer" is checked */}
          <label
            htmlFor="shared-computer"
            className="cursor-pointer ml-1 text-sm grid-inline"
          >
            This is a public or shared computer
          </label>
          <label
            htmlFor="registration"
            className="label mt-4 !p-0 hidden peer-checked:block"
          >
            <span className="text-red-400 text-left">
              In order to ensure the security of your private data, the ODD SDK
              does not recommend creating an account from a public or shared
              computer.
            </span>
          </label>
        </div>

        <div className="flex items-center mt-4">
          <Link
            className="!h-[52px] btn btn-outline !text-neutral-900 !border-neutral-900 !bg-neutral-50"
            to="/connect"
          >
            Cancel
          </Link>
          <button
            className="ml-2 !h-[52px] flex-1 btn btn-primary disabled:opacity-50 disabled:border-neutral-900 disabled:text-neutral-900"
            disabled={buttonDisabled}
            type="submit"
          >
            Create your account
          </button>
        </div>
      </form>
      {/* Existing Account */}
      <div className="flex flex-col gap-5 w-full">
        <button
          className={`btn btn-outline !h-[52px] w-full ${existingAccount
            ? '!bg-base-content !text-base-100 !border-base-content'
            : ''}`}
          onClick={() => setExistingAccount(!existingAccount)}
        >
          I have an existing account
        </button>
        {existingAccount && (
          <div className="flex flex-col gap-4 p-6 rounded bg-neutral-200 text-neutral-900">
            <h3 className="text-sm text-center">
              Which device are you connected on?
            </h3>
            <p>To connect your existing account, you&apos;ll need to:</p>
            <ol className="pl-6 list-decimal">
              <li>Find a device the account is already connected on</li>
              <li>Navigate to your Account Settings</li>
              <li>Click &ldquo;Connect a new device&rdquo;</li>
            </ol>
          </div>
        )}
      </div>

      {/* Recovery Link */}
      <Link to="/recover" className="underline">
        Recover an account
      </Link>
    </div>
  );
};

export default Register;
