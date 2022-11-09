import { Link } from 'react-router-dom'

import { appName } from '../../../lib/app-info'
import type { ConnectView } from '../../../lib/views'

type Props = {
  changeView: (view: ConnectView ) => void;
}

const Connect = ({ changeView }: Props) => {
  const handleChangeView = () => changeView("open-connected-device");

  return (
    <>
      <input
        type="checkbox"
        id="connect-modal"
        checked
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box w-narrowModal relative text-center">
          <Link to="/" className="btn btn-xs btn-circle absolute right-2 top-2">
            ✕
          </Link>

          <div>
            <h3 className="mb-7 text-base">Connect to {appName}</h3>
            <div>
              <Link className="btn btn-primary mb-5 w-full" to="/register">
                Create a new account
              </Link>
              <button
                className="btn btn-outline w-full"
                onClick={handleChangeView}
              >
                I have an existing account
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Connect;
