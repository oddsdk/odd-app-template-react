import './App.css';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useRecoilValue } from 'recoil';

import init from "./lib/init";
import { themeStore } from './stores';
import Header from './components/Header';
import Notifications from './components/notifications/Notifications';
import Home from './routes/HomeRoute';
import Backup from "./routes/BackupRoute";
import Connect from './routes/ConnectRoute';
import DelegateAccount from './routes/DelegateAccountRoute';
import LinkDevice from './routes/LinkDeviceRoute';
import Gallery from './routes/GalleryRoute';
import Register from './routes/RegisterRoute';

const App = () => {
  const theme = useRecoilValue(themeStore);

  const useMountEffect = () =>
    useEffect(() => {
      init()
    }, []);

  useMountEffect()

  return (
    <div data-theme={theme} className="App min-h-screen">
      <Router>
        <Header />
        <Notifications />
        <Routes>
          <Route path="/backup" element={<Backup />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/delegate-account" element={<DelegateAccount />} />
          <Route path="/link-device" element={<LinkDevice />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
