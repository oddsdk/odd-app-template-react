import { Link, useNavigate } from 'react-router-dom'
import clipboardCopy from 'clipboard-copy'

import { addNotification } from '../../../lib/notifications'
import Share from '../../icons/Share'

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
    await clipboardCopy(connectionLink);
    addNotification({ msg: 'Copied to clipboard', type: 'success' });
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
        <div className="modal-box w-narrowModal relative text-center">
          <div>
            <h3 className="mb-8 text-base">Connect a backup device</h3>
            <div className="w-max m-auto mb-7 rounded-lg overflow-hidden">
              <div dangerouslySetInnerHTML={{ __html: qrcode }} />
            </div>
            <p className="mb-7 text-left">
              Scan this code on the new device, or share the connection link.
            </p>
            <button className="btn btn-outline" onClick={handleCopyLink}>
              <Share />
              <span className="ml-2">Share connection link</span>
            </button>
            {!backupCreated ? (
              <button
                className="btn btn-xs btn-link text-sm font-normal underline mt-4"
                onClick={() => navigate("/backup?view=are-you-sure")}
              >
                Skip for now
              </button>
            ) : (
              <Link
                className="btn btn-xs btn-link text-sm font-normal underline mt-4"
                to="/"
              >
                Cancel
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ConnectBackupDevice;
