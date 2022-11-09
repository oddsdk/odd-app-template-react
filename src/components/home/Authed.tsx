import { useRecoilValue } from 'recoil';
import { Link } from 'react-router-dom'

import { sessionStore } from '../../stores';

const Authed = () => {
  const session = useRecoilValue(sessionStore)

  return (
    <div className="min-h-[calc(100vh-128px)] md:min-h-[calc(100vh-160px)] pt-8 md:pt-16 flex flex-col items-start max-w-[690px] m-auto gap-10 pb-5 text-sm">
      <h1 className="text-xl">
        Welcome,{" "}
        <span className="font-bold uppercase">
          {session.username}
        </span>
        !
      </h1>

      <div className="flex flex-col items-start justify-center gap-5">
        <h2 className="text-lg">Photo Gallery Demo</h2>
        <p>
          Webnative makes it easy to implement private, encrypted, user-owned
          storage in your app. See it in action with our photo gallery demo.
        </p>
        <Link className="btn btn-primary" to="/gallery">
          Try the Photo Gallery Demo
        </Link>
      </div>
    </div>
  );
};

export default Authed;
