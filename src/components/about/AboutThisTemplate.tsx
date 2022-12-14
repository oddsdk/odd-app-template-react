const AboutThisTemplate = () => (
  <div className="min-h-[calc(100vh-128px)] md:min-h-[calc(100vh-160px)] pt-8 md:pt-16 flex flex-col items-start max-w-[690px] m-auto gap-10 pb-5 text-sm">
    <h1 className="text-xl">About This Template</h1>

    <div className="max-w-[573px]">
      <p className="mb-5">
        <a
          className="link text-blue-600 whitespace-nowrap pr-1"
          href="https://github.com/fission-codes/webnative"
          target="_blank"
          rel="noreferrer"
        >
          Webnative SDK
          <span className="-scale-x-100 scale-y-100 inline-block">⎋</span>
        </a>
        is a true local-first edge computing stack.
      </p>
      <p>
        You can fork this
        <a
          className="link text-blue-600 whitespace-nowrap px-1"
          href="https://github.com/webnative-examples/webnative-app-template-react"
          target="_blank"
          rel="noreferrer"
        >
          template
          <span className="-scale-x-100 scale-y-100 inline-block">⎋</span>
        </a>
        to start writing your own Webnative app. Learn more in the
        <a
          className="link text-blue-600 whitespace-nowrap pl-1"
          href="https://guide.fission.codes/"
          target="_blank"
          rel="noreferrer"
        >
          Webnative Guide
          <span className="-scale-x-100 scale-y-100 inline-block">⎋</span>
        </a>
        .
      </p>
    </div>
  </div>
);

export default AboutThisTemplate
