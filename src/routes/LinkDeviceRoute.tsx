import { useContext, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import type { account } from 'webnative'

import FilesystemContext from '../contexts/FilesystemContext';
import NotificationsContext from '../contexts/NotificationsContext';
import SessionContext from '../contexts/SessionContext';
import { addNotification } from '../lib/notifications'
import { createAccountLinkingConsumer } from '../lib/auth/linking'
import { loadAccount } from '../lib/auth/account'
import type { LinkDeviceView } from '../lib/views'
import FilesystemActivity from '../components/common/FilesystemActivity'
import LinkDevice from '../components/auth/link-device/LinkDevice'

let view: LinkDeviceView = 'link-device'

let accountLinkingConsumer: account.AccountLinkingConsumer
let displayPin: string = ''

const useQuery = () => {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
};

const LinkDeviceRoute = () => {
  const navigate = useNavigate();
  const { updateFilesystem } = useContext(FilesystemContext)
  const notificationsContext = useContext(NotificationsContext)
  const sessionContext = useContext(SessionContext)

  let query = useQuery();
  const username = query.get('username') as string;

  const initAccountLinkingConsumer = async () => {
    accountLinkingConsumer = await createAccountLinkingConsumer(username);

    accountLinkingConsumer.on('challenge', ({ pin }) => {
      displayPin = pin.join('');
    });

    accountLinkingConsumer.on('link', async ({ approved, username }) => {
      if (approved) {
        view = 'load-filesystem';

        await loadAccount({ username, updateFilesystem, ...sessionContext });

        addNotification({ notification: { msg: 'You\'re now connected!', type: 'success' }, ...notificationsContext });
        navigate('/');
      } else {
        addNotification({ notification: { msg: 'The connection attempt was cancelled', type: 'info'}, ...notificationsContext });
        navigate('/');
      }
    });
  };

  const cancelConnection = async () => {
    addNotification({ notification: { msg: 'The connection attempt was cancelled', type: 'info' }, ...notificationsContext });

    accountLinkingConsumer?.cancel();
    navigate('/');
  };

  const useMountEffect = () =>
    useEffect(() => {
      initAccountLinkingConsumer();
    }, []);

  useMountEffect();

  return (
    <>
      <input
        type="checkbox"
        id="my-modal-5"
        defaultChecked
        className="modal-toggle"
      />

      {view === "link-device" && (
        <LinkDevice pin={displayPin} cancelConnection={cancelConnection} />
      )}
      {view === "load-filesystem" && <FilesystemActivity activity="Loading" />}
    </>
  );
};

export default LinkDeviceRoute;
