import { FC } from 'react';

const ChevronDownIcon: FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="15"
      height="9"
      viewBox="0 0 15 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1.5 1.5L7.5 7.5L13.5 1.5"
        stroke="#667080"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ChevronDownIcon;
