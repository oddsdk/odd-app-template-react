import { useEffect, useRef, useState } from 'react'
// import { Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import { sessionStore } from '../../stores'
import { generateRecoveryKit } from '../../lib/account-settings'
import Download from '../icons/Download'

type Props = {
  handleToggleModal: () => void
}

const RecoveryKitModal = ({ handleToggleModal }: Props) => {
  const session = useRecoilValue(sessionStore)
  const [fileURL, setFileURL] = useState(null)
  const downloadLinkRef = useRef(null);

  const prepareRecoveryKitDownload = async () => {
    const recoveryKit = await generateRecoveryKit()
    const data = new Blob([recoveryKit], { type: 'text/plain' })

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (fileURL !== null) {
      window.URL.revokeObjectURL(fileURL)
    }

    const localFileURL = window.URL.createObjectURL(data)
    setFileURL(localFileURL)
  }

  const useMountEffect = () =>
    useEffect(() => {
      prepareRecoveryKitDownload();
    }, []);

  useMountEffect();

  useEffect(() => {
    if (downloadLinkRef && fileURL) {
      downloadLinkRef.current.setAttribute(
        "download",
        `ODD-RecoveryKit-${session.username.trimmed}.txt`
      );
      downloadLinkRef.current.href = fileURL;
    }
  }, [downloadLinkRef, fileURL]);

  return (
    <>
      <input
        type="checkbox"
        id="recovery-kit-modal"
        defaultChecked
        className="modal-toggle"
      />
      <div className="modal !z-max">
        <div className="modal-box w-narrowModal sm:w-wideModal relative text-center sm:!pr-11 sm:!pb-11 sm:!pl-11">
          <button
            className="btn btn-xs btn-circle absolute right-2 top-2"
            onClick={handleToggleModal}
          >
            ✕
          </button>

          <div>
            {!fileURL ? (
              <>
                <h3 className="mb-7 text-base">
                  Creating your recovery kit...
                </h3>

                <div className="flex items-center justify-center text-base-content">
                  <span className="rounded-lg border-t-2 border-l-2 border-base-content w-4 h-4 inline-block animate-spin mr-2" />
                </div>
              </>
            ) : (
              <>
                <h3 className="mb-7 text-base">
                  Your recovery kit has been created!
                </h3>

                <div className="text-left mb-6">
                  <p className="mb-2">
                    Please store it somewhere safe for two reasons:
                  </p>
                  <ol className="list-decimal mb-2 pl-6">
                    <li>
                      <strong>It is powerful:</strong>
                      Anyone with this recovery kit will have access to all of
                      your private data.
                    </li>
                    <li>
                      <strong>It&apos;s your backup plan:</strong>
                      If you lose access to your connected devices, this kit
                      will help you recover your private data.
                    </li>
                  </ol>
                  <p>
                    So, keep it somewhere you keep things you don&apos;t want to
                    lose or have stolen.
                  </p>
                </div>

                <a
                  className="btn btn-primary w-[227px] gap-2"
                  ref={downloadLinkRef}
                >
                  <Download /> Download recovery kit
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default RecoveryKitModal
