import { Link } from 'react-router-dom'

import { appName } from '../../lib/app-info'

const Public = () => (
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
          including the ability to work offline and collaborate across multiple
          devices
        </li>
      </ul>

      <Link className="btn btn-primary btn-sm !h-10" to="/connect">
        Connect
      </Link>
    </div>
  </div>
);

export default Public;
