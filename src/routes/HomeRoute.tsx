import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from "recoil";

import { appName } from '../lib/app-info';
import { sessionStore } from '../stores';
import Shield from '../components/icons/Shield';

const HomeRoute = () => {
  const navigate = useNavigate();
  const session = useRecoilValue(sessionStore);

  return (
    <>
      <div className="grid grid-flow-row auto-rows-max gap-5 justify-items-center pb-5">
        <h1 className="text-2xl">Welcome to {appName}!</h1>

        {session?.authed && (
          <>
            <div className="card card-bordered w-96 dark:border-slate-600">
              <div className="card-body text-left">
                <h2 className="card-title">👋 Account</h2>
                <p>
                  Your username is
                  <span className="inline-block ml-1 px-1 font-mono bg-slate-300 dark:bg-slate-700 rounded-md">
                    {session.username}
                  </span>
                </p>

                <>
                  {session.backupCreated ? (
                    <p>✅ You have connected your account on another device.</p>
                  ) : (
                    <p>
                      <span className="h-7 w-7 mr-1 inline-block bg-orange-300 rounded-full font-normal text-center">
                        <Shield />
                      </span>
                      You have not connected your account on another device.
                    </p>
                  )}
                </>
                <div className="card-actions justify-center mt-3">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate('/delegate-account')}
                  >
                    Connect a new device
                  </button>
                </div>
              </div>
            </div>

            <div className="card w-96 card-bordered dark:border-slate-600">
              <div className="card-body text-left">
                <h2 className="card-title">📷 Photo Gallery Demo</h2>
                <p>
                  Try out the Webnative File System by storing your photos in
                  public and private storage.
                </p>
                <div className="card-actions justify-center">
                  <a className="btn btn-primary" href="/gallery">
                    Go to Photos
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
        <div className="card card-bordered w-96 dark:border-slate-600">
          <div className="card-body text-left">
            <h2 className="card-title">About</h2>
            <p>
              This app is a template for building apps with the
              <a
                className="inline-block pl-1 link link-primary whitespace-nowrap"
                href="https://github.com/fission-codes/webnative"
                target="_blank"
                rel="noreferrer"
              >
                Webnative SDK
                <span className="-scale-x-100 scale-y-100 inline-block px-1">
                  ⎋
                </span>
              </a>
            </p>
            <p>
              Get started
              <a
                className="inline-block px-1 link link-primary"
                href="https://github.com/fission-codes/webnative-app-template"
                target="_blank"
                rel="noreferrer"
              >
                using this template
                <span className="-scale-x-100 scale-y-100 inline-block px-1">
                  ⎋
                </span>
              </a>
              and learn more in the
              <a
                className="inline-block pl-1 link link-primary"
                href="https://guide.fission.codes/developers/webnative"
                target="_blank"
                rel="noreferrer"
              >
                Webnative Guide
                <span className="-scale-x-100 scale-y-100 inline-block px-1">
                  ⎋
                </span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeRoute;
