import { useRecoilValue } from "recoil";

import { sessionStore } from "../../stores";

const Username = () => {
  const session = useRecoilValue(sessionStore);
  const usernameParts = session?.username?.full?.split("#");

  return (
    <>
      {usernameParts[0]}
      <span className="text-neutral-500 -ml-[3px]">
        #{usernameParts[1].substring(0, 12)}...
        {usernameParts[1].substring(usernameParts[1].length - 5)}
      </span>
    </>
  );
};

export default Username;
