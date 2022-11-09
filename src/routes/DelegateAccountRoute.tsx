import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from "recoil";
import QRCode from 'qrcode-svg'

import { filesystemStore, sessionStore, themeStore } from '../stores';
import { addNotification } from '../lib/notifications';
import { createAccountLinkingProducer } from '../lib/auth/linking';
import { THEME } from '../lib/theme';
import { getBackupStatus, setBackupStatus } from '../lib/auth/backup';
import ConnectBackupDevice from '../components/auth/delegate-account/ConnectBackupDevice';
import DelegateAccount from '../components/auth/delegate-account/DelegateAccount';
import type { DelegateAccountView } from '../lib/views';

const DelegateAccountRoute = () => {
  const navigate = useNavigate();
  const fs = useRecoilValue(filesystemStore);
  const [session, setSession] = useRecoilState(sessionStore);
  const theme = useRecoilValue(themeStore);
  const [backupCreated, setBackupCreated] = useState(true);
  const [connectionLink, setConnectionLink] = useState('')
  const [view, setView] = useState<DelegateAccountView>(
    'connect-backup-device'
  );
  const [qrcode, setQrcode] = useState('')
  const [pin, setPin] = useState<number[]>();
  const [pinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [confirmPin, setConfirmPin] = useState<() => void>(() => undefined);
  const [rejectPin, setRejectPin] = useState<() => void>(() => undefined);

  const initAccountLinkingProducer = async (username: string) => {
    const accountLinkingProducer = await createAccountLinkingProducer(username)

    accountLinkingProducer.on('challenge', detail => {
      setPin(detail.pin)
      setConfirmPin(detail.confirmPin);
      setRejectPin(detail.rejectPin);

      setView('delegate-account')
    })

    accountLinkingProducer.on('link', async ({ approved }) => {
      if (approved) {
        setSession({
          ...session,
          backupCreated: true,
        });

        if (fs) {
          await setBackupStatus({ created: true })

          addNotification({ msg: 'You\'ve connected a backup device!', type: 'success' })
          navigate('/')
        } else {
          addNotification({ msg: 'Missing filesystem. Unable to create a backup device.', type: 'error' })
        }
      }
    })
  }

  const cancelConnection = () => {
    rejectPin();

    addNotification({ msg: 'The connection attempt was cancelled', type: 'info' })
    navigate('/');
  };

  const checkPin = () => {
    if (pin?.join('') === pinInput) {
      confirmPin();
    } else {
      setPinError(true);
    }
  };

  const useMountEffect = () =>
    useEffect(() => {
      if (fs) {
        const updateBackupCreated = async () => {
          const backupStatus = await getBackupStatus(fs);
          setBackupCreated(!!backupStatus?.created);
        }
        updateBackupCreated();
      }

      const username = session.username

      if (username) {
        const origin = window.location.origin

        const updatedConnectionLink = `${origin}/link-device?username=${username}`;
        setConnectionLink(updatedConnectionLink);
        setQrcode(
          new QRCode({
            content: updatedConnectionLink,
            color: theme === THEME.LIGHT ? "#171717" : "#FAFAFA",
            background: theme === THEME.LIGHT ? "#FAFAFA" : "#171717",
            padding: 0,
            width: 216,
            height: 216,
          }).svg()
        );

        initAccountLinkingProducer(username)
      }
    }, []);

  useMountEffect()

  if (view === 'connect-backup-device') {
    return (
      <ConnectBackupDevice qrcode={qrcode} connectionLink={connectionLink} backupCreated={backupCreated} />
    );
  } else if (view === 'delegate-account') {
    return (
      <DelegateAccount
        pinInput={pinInput}
        pinError={pinError}
        cancelConnection={cancelConnection}
        checkPin={checkPin}
      />
    );
  }

  return null;
};

export default DelegateAccountRoute;
