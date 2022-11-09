import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useRecoilValue } from 'recoil';

import init from "./lib/init";
import { themeStore } from './stores';
import Header from './components/Header';
import Footer from './components/Footer';
import SidebarNav from './components/nav/SidebarNav';
import Notifications from './components/notifications/Notifications';
import About from './routes/AboutRoute';
import Home from './routes/HomeRoute';
import Backup from "./routes/BackupRoute";
import Connect from './routes/ConnectRoute';
import DelegateAccount from './routes/DelegateAccountRoute';
import LinkDevice from './routes/LinkDeviceRoute';
import Gallery from './routes/gallery/GalleryRoute';
import Register from './routes/RegisterRoute';
import Settings from './routes/SettingsRoute';
import NotFound from './routes/NotFoundRoute';

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
        <Notifications />
        <SidebarNav>
          <Header />
          <div className="px-4">
            <Routes>
              <Route path="/backup" element={<Backup />} />
              <Route path="/connect" element={<Connect />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/delegate-account" element={<DelegateAccount />} />
              <Route path="/link-device" element={<LinkDevice />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/" element={<Home />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </SidebarNav>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
