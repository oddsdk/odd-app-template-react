const OpenConnectDevice = () => (
  <>
    <input
      type="checkbox"
      id="open-connected-device-modal"
      checked
      className="modal-toggle"
    />
    <div className="modal">
      <div className="modal-box w-96 sm:w-wideModal relative text-center">
        <a href="/" className="btn btn-xs btn-circle absolute right-2 top-2">
          ✕
        </a>
        <div>
          <h3 className="mb-8 text-base">Connect your existing account</h3>
          <div>
            <p className="text-sm text-left mb-6">
              To connect your existing account on this device, you’ll need a
              device you are already connected on.
            </p>
            <p className="text-sm text-left">
              On that device, click “Connect a new device” and follow the
              instructions.
            </p>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default OpenConnectDevice;
