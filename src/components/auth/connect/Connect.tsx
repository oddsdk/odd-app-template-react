
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
        defaultChecked
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box w-80 relative text-center dark:border-slate-600 dark:border">
          <a
            href="/"
            className="btn btn-xs btn-circle absolute right-2 top-2 dark:bg-slate-600"
          >
            ✕
          </a>

          <div>
            <h3 className="mb-7 text-xl font-serif">Connect to {appName}</h3>
            <div>
              <a className="btn btn-primary mb-5 w-full" href="/register">
                Create a new account
              </a>
              <button
                className="btn btn-primary btn-outline w-full"
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
