type Props = {
  cancelConnection: () => void;
  checkPin: () => void;
  pinError: boolean;
  pinInput: string;
};

const DelegateAccount = ({
  cancelConnection,
  checkPin,
  pinError,
  pinInput,
}: Props) => {
  const handleCancelConnection = () => cancelConnection();
  const handleCheckPin = () => checkPin();

  return (
    <>
      <input
        type="checkbox"
        id="delegate-account-modal"
        defaultChecked
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box w-80 relative text-center dark:border-slate-600 dark:border">
          <div>
            <h3 className="mb-7 text-xl font-serif">
              A new device would like to connect to your account
            </h3>
            <div className="mb-5">
              <input
                id="pin"
                type="text"
                className="input input-bordered w-full max-w-xs mb-2 rounded-full h-16 font-mono text-3xl text-center tracking-[0.18em] font-light dark:border-slate-300"
                value={pinInput}
              />
              <label htmlFor="pin" className="label">
                {!pinError ? (
                  <span className="label-text-alt text-slate-500">
                    Enter the connection code to approve the connection.
                  </span>
                ) : (
                  <span className="label-text-alt text-error">
                    Entered pin does not match a pin from a known device.
                  </span>
                )}
              </label>
            </div>
            <div>
              <button
                className="btn btn-primary mb-5 w-full"
                onClick={handleCheckPin}
              >
                Approve the connection
              </button>
              <button
                className="btn btn-primary btn-outline w-full"
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

export default DelegateAccount;
