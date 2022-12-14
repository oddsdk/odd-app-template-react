import { useState } from 'react'

import RecoveryKitModal from './RecoveryKitModal'

const RecoveryKit = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const handleToggleModal = async () => setModalOpen(!modalOpen)

  return (
    <>
      <div className="flex flex-col gap-4">
        <h3 className="text-lg">Recovery Kit</h3>
        <p>
          Your recovery kit will restore access to your data in the event that
          you lose access to all of your connected devices. We recommend you
          store your kit in a safe place, separate from those devices.
        </p>

        <button className="btn btn-primary w-fit" onClick={handleToggleModal}>
          Create your recovery kit
        </button>
      </div>

      {modalOpen && <RecoveryKitModal handleToggleModal={handleToggleModal} />}
    </>
  );
}

export default RecoveryKit
