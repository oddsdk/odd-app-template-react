const OpenConnectDevice = () => (
  <>
    <input
      type="checkbox"
      id="open-connected-device-modal"
      defaultChecked
      className="modal-toggle"
    />
    <div className="modal">
      <div className="modal-box w-96 relative text-center">
        <a href="/" className="btn btn-xs btn-circle absolute right-2 top-2">
          ✕
        </a>
        <div>
          <h3 className="mb-5 text-2xl font-serif">
            Connect an existing account
          </h3>
          <div>
            <p className="text-sm mb-3">
              To connect with an existing account, you&apos;ll need a device
              that&apos;s already connected to that account.
            </p>
            <p className="text-sm">
              On that device, click &quot;Connect a new device&quot; and follow
              the instuctions.
            </p>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default OpenConnectDevice;
