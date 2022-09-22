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
        defaultChecked
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box w-80 relative text-center dark:border-slate-600 dark:border">
          <div id="backup-message" className="peer-checked:hidden">
            <h3 className="mb-7 text-xl font-serif">Backup your account</h3>
            <p className="mt-8 mb-4">
              Your {appName} account & its data live only on your devices.
            </p>

            <p className="mt-8 mb-4">
              We highly recommend connecting your account on at least one more
              device, so that you have a backup.
            </p>

            <button
              className="btn btn-primary"
              onClick={() => navigate('/delegate-account')}
            >
              Connect a backup device
            </button>
            <button
              className="btn btn-xs btn-link text-base font-normal underline mt-4"
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
