import { FC } from 'react';

const HelpIcon: FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="26"
      height="22"
      viewBox="0 0 24 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 17H12.01M12 14C12.8906 12.0938 15 12.2344 15 10C15 8.5 14 7 12 7C10.4521 7 9.50325 7.89844 9.15332 9M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default HelpIcon;
