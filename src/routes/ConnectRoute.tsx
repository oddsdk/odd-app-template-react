import type { ConnectView } from '../lib/views'
import Connect from '../components/auth/connect/Connect'
import OpenConnectedDevice from '../components/auth/connect/OpenConnectedDevice'

let view: ConnectView = 'connect'

const handleChangeView = (updatedView: ConnectView ) => {
  view = updatedView;
};

const ConnectRoute = () => {
  if (view === 'connect') {
    return <Connect changeView={handleChangeView} />;
  } else if (view === 'open-connected-device') {
    return <OpenConnectedDevice />;
  }

  return null;
}

export default ConnectRoute;
