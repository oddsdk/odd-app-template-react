import { Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import { sessionStore } from "../../stores";
import { appName } from '../../lib/app-info'
import Alert from "../../components/icons/Alert";
import Connect from "../../components/icons/Connect";

const Public = () => {
  const session = useRecoilValue(sessionStore)

  return (
    <div className="min-h-[calc(100vh-96px)] flex flex-col items-start justify-center max-w-[700px] m-auto gap-6 pb-5 text-sm">
      <h1 className="text-xl">Welcome to the {appName}</h1>

      <div className="max-w-[590px]">
        <p className="mb-5">
          Webnative SDK is a true local-first edge computing stack. Effortlessly
          give your users:
        </p>

        <ul className="mb-6 pl-6 list-disc">
          <li>
            <span className="font-bold">modern, passwordless accounts</span>,
            without a complex and costly cloud-native back-end
          </li>
          <li>
            <span className="font-bold">user-controlled data</span>, secured by
            default with our encrypted-at-rest file storage protocol
          </li>
          <li>
            <span className="font-bold">local-first functionality</span>,
            including the ability to work offline and collaborate across
            multiple devices
          </li>
        </ul>

        {session.error === "Unsupported Browser" ? (
          <div className="p-4 rounded-lg bg-base-content text-neutral-50">
            <h3 className="flex items-center gap-2 text-base">
              <span className="-translate-y-[2px]">
                <Alert />
              </span>
              Unsupported device
            </h3>
            <p>
              It appears this device isn’t supported. Webnative requires
              IndexedDB in order to function. This browser doesn’t appear to
              implement this API. Are you in a Firefox private window?
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-4">
            <Link
              className="btn btn-primary !btn-lg !h-10 gap-2"
              to="/register"
            >
              <Connect /> Connect this device
            </Link>
            <Link className="btn btn-outline" to="/recover">
              Recover an existing account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Public;
