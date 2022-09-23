import { useState } from 'react';

import type { ConnectView } from '../lib/views';
import Connect from '../components/auth/connect/Connect';
import OpenConnectedDevice from '../components/auth/connect/OpenConnectedDevice';

const ConnectRoute = () => {
  const [view, setView] = useState<ConnectView>("connect");

  if (view === 'connect') {
    return <Connect changeView={setView} />;
  } else if (view === 'open-connected-device') {
    return <OpenConnectedDevice />;
  }

  return null;
}

export default ConnectRoute;
