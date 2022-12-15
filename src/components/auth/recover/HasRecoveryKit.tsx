import { useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import * as uint8arrays from 'uint8arrays'
import * as RootKey from 'webnative/common/root-key'
import * as UCAN from "webnative/ucan/index";
import * as DID from "webnative/did/index";

import { filesystemStore, sessionStore } from '../../../stores'
import {
  RECOVERY_STATES,
  USERNAME_STORAGE_KEY,
  loadAccount,
  prepareUsername
} from '../../../lib/auth/account'
import Check from '../../icons/CheckIcon'
import RecoveryKitButton from './RecoveryKitButton'

const HasRecoveryKit = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setFilesystem] = useRecoilState(filesystemStore)
  const session = useRecoilValue(sessionStore)

  const [state, setState] = useState<RECOVERY_STATES>(
    session.session ? RECOVERY_STATES.Done : RECOVERY_STATES.Ready
  );

    /**
   * Parse the user's `username` and `readKey` from the uploaded recovery kit and pass them into
   * webnative to recover the user's account and populate the `session` and `filesystem` stores
   * @param files
   */
  const handleFileInput: (
    files: FileList
  ) => Promise<void> = async files => {
    const reader = new FileReader()
    reader.onload = async event => {
      setState(RECOVERY_STATES.Processing)
      try {
        const {
          authStrategy,
          program: {
            components: { crypto, reference, storage }
          }
        } = session

        const parts = (event.target.result as string)
          .split('username: ')[1]
          .split('key: ')
        const readKey = uint8arrays.fromString(
          parts[1].replace(/(\r\n|\n|\r)/gm, ""),
          "base64pad"
        );

        const oldUsername = parts[0].replace(/(\r\n|\n|\r)/gm, "");
        const hashedOldUsername = await prepareUsername(oldUsername);
        const oldRootDID = await reference.didRoot.lookup(hashedOldUsername);

        // Construct a new username using the old `trimmed` name and `oldRootDID`
        const newUsername = `${oldUsername.split("#")[0]}#${oldRootDID}`;
        const hashedNewUsername = await prepareUsername(newUsername);

        storage.setItem(USERNAME_STORAGE_KEY, newUsername);

        // Register the user with the `hashedNewUsername`
        const { success } = await authStrategy.register({
          username: hashedNewUsername,
        });
        if (!success) {
          throw new Error("Failed to register new user");
        }

        // Build an ephemeral UCAN to allow the
        const issuer = await DID.write(crypto);
        const proof: string | null = await storage.getItem(
          storage.KEYS.ACCOUNT_UCAN
        );
        const ucan = await UCAN.build({
          dependencies: session.program.components,
          potency: "APPEND",
          resource: "*",
          proof: proof ? proof : undefined,
          lifetimeInSeconds: 60 * 3, // Three minutes
          audience: issuer,
          issuer,
        });

        const newRootDID = await reference.didRoot.lookup(hashedNewUsername);
        const oldRootCID = await reference.dataRoot.lookup(hashedOldUsername);

        // Update the dataRoot of the new user
        await reference.dataRoot.update(oldRootCID, ucan);

        // Store the accountDID and readKey in webnative so they can be used internally load the file system
        await RootKey.store({
          accountDID: newRootDID,
          readKey,
          crypto: crypto,
        });

        // Load account data into sessionStore
        await loadAccount(hashedNewUsername, newUsername);

        setState(RECOVERY_STATES.Done)
      } catch (error) {
        console.error(error)
        setState(RECOVERY_STATES.Error)
      }
    }
    reader.onerror = error => {
      console.error(error)
      setState(RECOVERY_STATES.Error)
    }
    reader.readAsText(files[0])
  }


  return (
    <div
      className="min-h-[calc(100vh-96px)] flex flex-col items-start justify-center max-w-[590px] m-auto gap-6 pb-5 text-sm"
    >
      <h1 className="text-xl">Recover your account</h1>

      {state === RECOVERY_STATES.Done ? (
        <>
          <h3 className="flex items-center gap-2 font-normal text-base text-green-600">
            <Check /> Account recovered!
          </h3>
          <p>
            Welcome back <strong>{session.username.trimmed}.</strong>
            We were able to successfully recover all of your private data.
          </p>
        </>
      ) : (
        <p>
          If you’ve lost access to all of your connected devices, you can use your
          recovery kit to restore access to your private data.
        </p>
      )}

      {state === RECOVERY_STATES.Error && (
        <p className="text-red-600">
          We were unable to recover your account. Please double check that you
          uploaded the correct file.
        </p>
      )}

      <div className="flex flex-col gap-2">
        <RecoveryKitButton handleFileInput={handleFileInput} state={state} />

        {state !== RECOVERY_STATES.Done && (
          <p className="text-xxs">
            {`It should be a file named Webnative-RecoveryKit-{yourUsername}.txt`}
          </p>
        )}
      </div>
    </div>
  )
}

export default HasRecoveryKit
