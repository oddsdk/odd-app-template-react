type Props = {
  classes?: string
}

const FileUploadIcon = ({ classes = "mb-3 w-10 h-10" }: Props) => (
  <svg
    aria-hidden="true"
    className={classes}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M7 16a4 4 0 0 1-.88-7.903A5 5 0 1 1 15.9 6h.1a5 5 0 0 1 1 9.9M15 13l-3-3m0 0-3 3m3-3v12"
    />
  </svg>
);

export default FileUploadIcon;
