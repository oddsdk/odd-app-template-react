
import { useNavigate } from 'react-router-dom'

import { RECOVERY_STATES } from '../../../lib/auth/account'
import RightArrow from '../../icons/RightArrow'
import Upload from '../../icons/Upload'

type Props = {
  handleFileInput: (files: FileList) => Promise<void>;
  state: RECOVERY_STATES
}

const RecoveryKitButton = ({ handleFileInput, state }: Props) => {
  const navigate = useNavigate()

  const buttonData = {
    [RECOVERY_STATES.Processing]: {
      text: 'Processing recovery kit...',
      props: {
        disabled: state === RECOVERY_STATES.Processing,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        on_click: () => {},
      }
    },
    [RECOVERY_STATES.Done]: {
      text: 'Continue to the app',
      props: {
        on_click: () => navigate('/')
      }
    }
  }

  if (state === RECOVERY_STATES.Ready || state === RECOVERY_STATES.Error) {
    return (
      <>
        <label
          htmlFor="upload-recovery-kit"
          className="btn btn-primary !btn-lg !h-[56px] !min-h-0 w-fit gap-2"
        >
          <Upload /> Upload your recovery kit
        </label>
        <input
          onChange={(e) => handleFileInput(e.target.files)}
          id="upload-recovery-kit"
          type="file"
          accept=".txt"
          className="hidden"
        />
      </>
    )
  }

  const { on_click, ...props } = buttonData[state].props

  return (
    <button
      className="btn btn-primary !btn-lg !h-[56px] !min-h-0 w-fit gap-2"
      {...props}
      onClick={on_click}
    >
      {state === RECOVERY_STATES.Processing && (
        <span className="animate-spin ease-linear rounded-full border-2 border-t-2 border-t-orange-500 border-neutral-900 w-[16px] h-[16px] text-sm" />
      )}
      {buttonData[state].text}
      {state === RECOVERY_STATES.Done && <RightArrow />}
    </button>
  );
}

export default RecoveryKitButton;
