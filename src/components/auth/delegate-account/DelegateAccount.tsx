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

  /**
   * Auto submit the form when the pinInput is equal to the TARGET_PIN_LENGTH
   */
  const TARGET_PIN_LENGTH = 6;
  const handleCheckPin = () => {
    if (pinInput.length === TARGET_PIN_LENGTH) {
      checkPin();
    } else {
      pinError = false;
    }
  };

  return (
    <>
      <input
        type="checkbox"
        id="delegate-account-modal"
        checked
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box w-narrowModal relative text-center">
          <div>
            <h3 className="mb-8 text-base">
              A new device would like to connect to your account
            </h3>
            <div className="mb-5">
              <input
                id="pin"
                type="text"
                className="input input-bordered w-full max-w-[197px] mb-2 rounded-full h-[68px] focus:outline-none font-mono text-deviceCode text-center tracking-[0.1em] font-light {pinError
                  ? '!text-red-500 !border-red-500'
                  : ''}"
                maxLength={6}
                value={pinInput}
                onKeyUp={handleCheckPin}
              />
              <label htmlFor="pin" className="label">
                {!pinError ? (
                  <span className="label-text-alt">
                    Enter the connection code from that device to approve this
                    connection.
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
                className="btn btn-outline w-full"
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
