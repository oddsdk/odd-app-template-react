import { useNavigate } from 'react-router-dom'
import clipboardCopy from 'clipboard-copy'

import ClipboardIcon from '../../icons/ClipboardIcon'

type Props = {
  backupCreated: boolean;
  connectionLink: string;
  qrcode: string;
}

const ConnectBackupDevice = ({
  backupCreated,
  connectionLink,
  qrcode,
}: Props) => {
  const navigate = useNavigate();

  const handleCopyLink = async () => {
    console.log("connectionLink", connectionLink);
    await clipboardCopy(connectionLink);
  };

  return (
    <>
      <input
        type="checkbox"
        id="backup-device-modal"
        defaultChecked
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box w-80 relative text-center dark:border-slate-600 dark:border">
          <div>
            <h3 className="pb-1 text-xl font-serif">Connect a backup device</h3>
            <div dangerouslySetInnerHTML={{ __html: qrcode }} />
            <p className="pt-1 mb-8">
              Scan this code on the new device, or share the connection link.
            </p>
            <button
              className="btn btn-primary btn-outline"
              onClick={handleCopyLink}
            >
              <ClipboardIcon />
              <span className="ml-2">Copy connection link</span>
            </button>
            {!backupCreated && (
              <button
                className="btn btn-xs btn-link text-base text-error font-normal underline mt-4"
                onClick={() => navigate("/backup?view=are-you-sure")}
              >
                Skip for now
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ConnectBackupDevice;
