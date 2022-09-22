import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import FilesystemContext from "../../../contexts/FilesystemContext";
import SessionContext from "../../../contexts/SessionContext";
import { setBackupStatus } from '../../../lib/auth/backup'

const AreYouSure = () => {
  const navigate = useNavigate();
  const { fs } = useContext(FilesystemContext);
  const { session, updateSession } = useContext(SessionContext);

  const handleSkipBackup = () => {
    setBackupStatus(fs, { created: false });

    updateSession({
      ...session,
      backupCreated: false,
    });

    navigate("/");
  };

  return (
    <>
      <input
        type="checkbox"
        id="are-you-sure-modal"
        defaultChecked
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box w-80 relative text-center dark:border-slate-600 dark:border">
          <div>
            <h3 className="mb-7 text-xl font-serif">Are you sure?</h3>

            <p className="mt-8 mb-6">
              Without a backup device, if you lose this device or reset your
              browser, you will not be able to recover your account data.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/delegate-account")}
            >
              Connect a backup device
            </button>
            <span
              className="text-error underline block mt-4 cursor-pointer"
              onClick={handleSkipBackup}
            >
              YOLO&mdash;I'll risk just one device for now
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AreYouSure;
