import { useRecoilValue } from "recoil";

import { sessionStore } from "../stores";
import Authed from "../components/home/Authed";
import Public from "../components/home/Public";

const HomeRoute = () => {
  const session = useRecoilValue(sessionStore);

  if (session.session) {
    return <Authed />;
  }

  return <Public />;
};

export default HomeRoute;
