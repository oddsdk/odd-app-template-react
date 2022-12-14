import { useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import * as uint8arrays from 'uint8arrays'
import * as RootKey from 'webnative/common/root-key'
import { loadFileSystem } from 'webnative/filesystem'
import { provide } from 'webnative/session'

import { filesystemStore, sessionStore } from '../../../stores'
import { NAMESPACE } from '../../../lib/init'
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
            components: { crypto, depot, manners, reference, storage }
          }
        } = session
        const parts = (event.target.result as string)
          .split('username: ')[1]
          .split('key: ')
        const username = parts[0].replace(/(\r\n|\n|\r)/gm, '')
        const hashedUsername = await prepareUsername(username)
        const readKey = uint8arrays.fromString(
          parts[1].replace(/(\r\n|\n|\r)/gm, ''),
          'base64pad'
        )
        storage.setItem(USERNAME_STORAGE_KEY, username)
        const rootDID = await reference.didRoot.lookup(hashedUsername)
        // Store the accountDID and readKey in webnative so they can be used internally load the file system
        await RootKey.store({
          accountDID: rootDID,
          readKey,
          crypto: crypto
        })
        // Recover the user's file system then pass it to the filesystemStore
        const fs = await loadFileSystem({
          username: hashedUsername,
          rootKey: readKey,
          config: { namespace: NAMESPACE },
          dependencies: { crypto, depot, manners, reference, storage }
        })
        setFilesystem(fs)
        // Save the current session to storage so it persists throughout hard refreshes
        await provide(storage, {
          type: authStrategy.implementation.type,
          username: hashedUsername
        })
        // Load account data into sessionStore
        await loadAccount(hashedUsername, username)
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
