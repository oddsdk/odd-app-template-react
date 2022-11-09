import clipboardCopy from "clipboard-copy";

import { appName } from "../../../lib/app-info";
import { addNotification } from "../../../lib/notifications";

type Props = {
  pin: string;
  cancelConnection: () => void;
};

const LinkDevice = ({ pin, cancelConnection }: Props) => {
  const handleCancelConnection = () => cancelConnection();

  const handleCopyCode = async () => {
    await clipboardCopy(pin);
    addNotification({ msg: 'Copied to clipboard', type: 'success' });
  };

  return (
    <>
      <input type="checkbox" id="my-modal-5" checked className="modal-toggle" />
      <div className="modal">
        <div className="modal-box w-narrowModal relative text-center dark:border-slate-600 dark:border">
          <div className="grid grid-flow-row auto-rows-max gap-7">
            <h3 className="text-base">Connect to {appName}</h3>
            <div className="grid grid-flow-row auto-rows-max gap-4 justify-items-center">
              {pin && (
                <span
                  onClick={handleCopyCode}
                  className="btn text-base-100 hover:text-base-100 bg-base-content hover:bg-base-content border-0 btn-lg rounded-full text-deviceCode tracking-[.18em] w-3/4 cursor-pointer font-mono font-light"
                >
                  {pin}
                </span>
              )}
              <span className="text-sm text-left">
                Enter this code on your connected device.
              </span>
              <div className="grid grid-flow-col auto-cols-max gap-4 justify-center items-center text-slate-500">
                <span className="rounded-lg border-t-2 border-l-2 border-slate-600 dark:border-slate-50 w-4 h-4 block animate-spin" />
                Waiting for a response...
              </div>
            </div>
            <div>
              <button
                className="btn btn-outline text-base mt-4"
                onClick={handleCancelConnection}
              >
                Cancel Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LinkDevice;
