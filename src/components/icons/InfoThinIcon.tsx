const InfoThinIcon = ({ color }: { color: string }) => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.8333 25.3333H18V18H16.1667M18 10.6667H18.0183M34.5 18C34.5 27.1127 27.1127 34.5 18 34.5C8.8873 34.5 1.5 27.1127 1.5 18C1.5 8.8873 8.8873 1.5 18 1.5C27.1127 1.5 34.5 8.8873 34.5 18Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default InfoThinIcon;
