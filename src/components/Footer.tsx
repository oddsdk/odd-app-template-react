import { useRecoilValue } from "recoil";

import { themeStore } from "../stores";
import { ThemeOptions } from "../lib/theme";

const Footer = () => {
  const theme = useRecoilValue(themeStore);
  /**
   * Firefox doesn't fully support background-clip so the marquee text is cut off half way through the animation
   */
  const isFirefox = navigator.userAgent.indexOf("Firefox") !== -1;

  return (
    <div className="fixed z-0 lg:z-20 right-0 bottom-0 left-0 h-8 flex items-center motion-reduce:justify-center motion-safe:justify-end bg-base-content overflow-x-hidden">
      {theme.selectedTheme === ThemeOptions.LIGHT ? (
        <p
          className={`motion-safe:animate-marquee motion-safe:left-full whitespace-nowrap font-bold text-xxs ${
            isFirefox
              ? "text-orange-500"
              : "text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-orange-600"
          }`}
        >
          *** Experimental *** - You are currently previewing Webnative SDK
          Alpha 0.2
        </p>
      ) : (
        <p className="motion-safe:animate-marquee motion-safe:left-full whitespace-nowrap font-bold text-xxs text-[#DD1F13]">
          *** Experimental *** - You are currently previewing Webnative SDK
          Alpha 0.2
        </p>
      )}
    </div>
  );
};

export default Footer;
