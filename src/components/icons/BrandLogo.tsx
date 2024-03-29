import { useRecoilValue } from "recoil";

import { themeStore } from "../../stores";

const BrandLogo = () => {
  const theme = useRecoilValue(themeStore);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="53" height="27" fill="none">
      <path
        fill="#F16583"
        d="M52.5 13.854c0 6.627-5.373 12-12 12s-12-5.373-12-12c0-6.628 5.373-12 12-12s12 5.372 12 12Z"
      />
      <path
        fill="#F16583"
        stroke={theme.selectedTheme === "light" ? "#FAFAFA" : "#171717"}
        d="M26.5 26.354c6.904 0 12.5-5.597 12.5-12.5 0-6.904-5.596-12.5-12.5-12.5S14 6.95 14 13.854c0 6.903 5.596 12.5 12.5 12.5Z"
      />
      <path
        fill={theme.selectedTheme === "light" ? "#FAFAFA" : "#171717"}
        stroke={theme.selectedTheme === "light" ? "#FAFAFA" : "#171717"}
        d="M12.745 26.354c6.757 0 12.214-5.608 12.214-12.5 0-6.893-5.457-12.5-12.214-12.5C5.988 1.354.53 6.96.53 13.854c0 6.892 5.458 12.5 12.215 12.5Z"
      />
      <path
        fill="#F16583"
        fillRule="evenodd"
        d="M12.745 21.597c4.174 0 7.559-3.467 7.559-7.744 0-4.276-3.385-7.743-7.56-7.743-4.174 0-7.558 3.467-7.558 7.744 0 4.276 3.384 7.743 7.559 7.743Zm0 4.256c6.47 0 11.714-5.372 11.714-12 0-6.627-5.245-12-11.714-12-6.47 0-11.715 5.373-11.715 12 0 6.628 5.245 12 11.715 12Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export default BrandLogo;
