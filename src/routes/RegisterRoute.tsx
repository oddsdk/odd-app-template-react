import { useContext } from 'react';
import SessionContext from '../contexts/SessionContext';
import Register from '../components/auth/register/Register'
import Welcome from '../components/auth/register/Welcome'

const RegisterRoute = () => {
  const { session } = useContext(SessionContext);

  if (session.authed) {
   return <Welcome />;
  } else {
    return <Register />;
  }
};

export default RegisterRoute;
