import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { sessionStore } from "../../stores";

const ConnectedDevices = () => {
  const session = useRecoilValue(sessionStore);

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg">Connected devices</h3>
      {session.backupCreated ? (
        <p>You have connected at least one other device.</p>
      ) : (
        <p>You have no other connected devices.</p>
      )}
      <Link className="btn btn-outline" to="/delegate-account">
        Connect an additional device
      </Link>
    </div>
  );
};

export default ConnectedDevices;
