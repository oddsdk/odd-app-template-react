type Props = {
  pin: string;
  cancelConnection: () => void;
};

const LinkDevice = ({ pin, cancelConnection }: Props) => {
  const handleCancelConnection = () => cancelConnection();

  return (
    <>
      <input
        type="checkbox"
        id="my-modal-5"
        defaultChecked
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box w-80 relative text-center dark:border-slate-600 dark:border">
          <div className="grid grid-flow-row auto-rows-max gap-7">
            <h3 className="text-xl font-serif">Connection Requested</h3>
            <div className="grid grid-flow-row auto-rows-max gap-4 justify-items-center">
              {pin && (
                <span className="btn bg-blue-100 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900 border-0 btn-lg rounded-full text-3xl tracking-[.18em] w-3/4 cursor-default font-mono font-light">
                  {pin}
                </span>
              )}
              <span className="text-md">
                Enter this code on your connected device.
              </span>
              <div className="grid grid-flow-col auto-cols-max gap-4 justify-center items-center text-slate-500">
                <span className="rounded-lg border-t-2 border-l-2 border-slate-600 dark:border-slate-50 w-4 h-4 block animate-spin" />
                Waiting for a response...
              </div>
            </div>
            <div>
              <button
                className="btn btn-primary btn-outline text-base font-normal mt-4"
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
