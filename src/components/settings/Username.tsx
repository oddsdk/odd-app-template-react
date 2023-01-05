import clipboardCopy from 'clipboard-copy'
import { useRecoilValue } from "recoil";

import { sessionStore } from '../../stores'
import { addNotification } from '../../lib/notifications'
import ClipboardIcon from '../icons/ClipboardIcon'
import TruncatedUsername from './TruncatedUsername'

const Username = () => {
  const session = useRecoilValue(sessionStore)

  const handleCopyUsername = async (): Promise<void> => {
    await clipboardCopy(session.username.full);
    addNotification({ msg: 'Copied to clipboard', type: 'success' })
  }

  return (
    <div>
      <h3 className="text-lg mb-4">Username</h3>
      <div className="flex items-center">
        <p>
          <TruncatedUsername />
        </p>
        <button
          className="pl-2 hover:text-neutral-500 transition-colors"
          onClick={handleCopyUsername}
        >
          <ClipboardIcon />
        </button>
      </div>
    </div>
  )
}

export default Username
