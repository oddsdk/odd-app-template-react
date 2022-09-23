import { useRecoilValue } from 'recoil';

import { sessionStore } from '../stores';
import Register from '../components/auth/register/Register'
import Welcome from '../components/auth/register/Welcome'

const RegisterRoute = () => {
  const session = useRecoilValue(sessionStore);

  if (session.authed) {
   return <Welcome />;
  } else {
    return <Register />;
  }
};

export default RegisterRoute;
