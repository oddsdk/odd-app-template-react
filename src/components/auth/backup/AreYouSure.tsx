import { useNavigate } from 'react-router-dom';
import { useRecoilState } from "recoil";

import { sessionStore } from '../../../stores';
import { setBackupStatus } from '../../../lib/auth/backup';

const AreYouSure = () => {
  const navigate = useNavigate();
  const [session, setSession] = useRecoilState(sessionStore);

  const handleSkipBackup = () => {
    setBackupStatus({ created: false });

    setSession({
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
        checked
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box w-narrowModal relative text-center">
          <div>
            <h3 className="mb-8 text-base">Are you sure?</h3>

            <p className="mb-7 text-left">
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
              className="text-error underline block mt-4 text-sm text-red-600 cursor-pointer"
              onClick={handleSkipBackup}
            >
              YOLO&mdash;I&apos;ll risk just one device for now
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AreYouSure;
