import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QRCode from 'qrcode-svg'

import { addNotification } from '../lib/notifications'
import { createAccountLinkingProducer } from '../lib/auth/linking'
import FilesystemContext from '../contexts/FilesystemContext';
import NotificationsContext from '../contexts/NotificationsContext';
import SessionContext from '../contexts/SessionContext';
import ThemeContext, { THEME } from '../contexts/ThemeContext';
import { getBackupStatus, setBackupStatus } from '../lib/auth/backup'
import ConnectBackupDevice from '../components/auth/delegate-account/ConnectBackupDevice'
import DelegateAccount from '../components/auth/delegate-account/DelegateAccount'
import type { DelegateAccountView } from '../lib/views'

const DelegateAccountRoute = () => {
  const navigate = useNavigate();
  const { fs } = useContext(FilesystemContext);
  const { notifications, updateNotifications } =
    useContext(NotificationsContext);
  const { session, updateSession } = useContext(SessionContext);
  const { theme } = useContext(ThemeContext);
  const [backupCreated, setBackupCreated] = useState(true);
  const [connectionLink, setConnectionLink] = useState('')
  const [view, setView] = useState<DelegateAccountView>(
    'connect-backup-device'
  );
  const [qrcode, setQrcode] = useState('')
  const [pin, setPin] = useState<number[]>();
  const [pinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [confirmPin, setConfirmPin] = useState<() => void>(() => {});
  const [rejectPin, setRejectPin] = useState<() => void>(() => {});

  const initAccountLinkingProducer = async (username: string) => {
    const accountLinkingProducer = await createAccountLinkingProducer(username)

    accountLinkingProducer.on('challenge', detail => {
      console.log('detail', detail)
      setPin(detail.pin)
      setConfirmPin(detail.confirmPin);
      setRejectPin(detail.rejectPin);

      setView('delegate-account')
    })

    accountLinkingProducer.on('link', async ({ approved }) => {
      if (approved) {
        updateSession({
          ...session,
          backupCreated: true
        })

        if (fs) {
          await setBackupStatus(fs, { created: true })

          addNotification({ notification: { msg: 'You\'ve connected a backup device!', type: 'success' }, notifications, updateNotifications })
          navigate('/')
        } else {
          addNotification({
            notification: {
              msg: 'Missing filesystem. Unable to create a backup device.',
              type: 'error',
            },
            notifications,
            updateNotifications,
          })
        }
      }
    })
  }

  const cancelConnection = () => {
    rejectPin();

    addNotification({ notification: { msg: 'The connection attempt was cancelled', type: 'info' }, notifications, updateNotifications })
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
            color: theme === THEME.LIGHT ? "#334155" : "#E2E8F0",
            background: "#ffffff00",
          }).svg()
        );

        initAccountLinkingProducer(username)
      }
    }, []);

  useEffect(() => {
    console.log("view", view);
  })

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
