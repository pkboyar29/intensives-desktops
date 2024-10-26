import { FC } from 'react';

const CaretIcon: FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="15"
      height="8"
      viewBox="0 0 15 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1.5 1L7.5 7L13.5 1"
        stroke="#667080"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CaretIcon;
