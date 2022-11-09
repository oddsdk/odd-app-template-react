import { useNavigate } from 'react-router-dom'

import type { BackupView } from '../../../lib/views'
import { appName } from '../../../lib/app-info'

type Props = {
  changeView: (view: BackupView) => void;
};

const Backup = ({ changeView  }: Props) => {
  const navigate = useNavigate();

  const handleChangeView = () => changeView('are-you-sure');

  return (
    <>
      <input
        type="checkbox"
        id="backup-modal"
        checked
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box w-narrowModal relative text-center">
          <div id="backup-message" className="peer-checked:hidden">
            <h3 className="mb-8 text-base">Backup your account</h3>
            <p className="mb-5 text-left">
              Your {appName} account & its data live only on your devices.
            </p>

            <p className="mb-8 text-left">
              We highly recommend backing up your account on at least one
              additional device.
            </p>

            <button
              className="btn btn-primary"
              onClick={() => navigate("/delegate-account")}
            >
              Connect a backup device
            </button>
            <button
              className="btn btn-xs btn-link text-sm underline mt-4"
              onClick={handleChangeView}
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Backup;
