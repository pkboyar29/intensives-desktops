import { FC } from 'react';

const PlusIcon: FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="19"
      height="20"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M10 1H6V6L1 6V10H6V15H10V10H15V6L10 6V1Z" fill="#000000" />
    </svg>
  );
};

export default PlusIcon;
