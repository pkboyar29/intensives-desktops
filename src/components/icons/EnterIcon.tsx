import { FC } from 'react';

const EnterIcon: FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="26"
      height="22"
      viewBox="0 0 24 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M20 5H8V9H6V3H22V21H6V15H8V19H20V5Z" fill="#000000" />
      <path
        d="M13.0743 16.9498L11.6601 15.5356L14.1957 13H2V11H14.1956L11.6601 8.46451L13.0743 7.05029L18.024 12L13.0743 16.9498Z"
        fill="#000000"
      />
    </svg>
  );
};

export default EnterIcon;
