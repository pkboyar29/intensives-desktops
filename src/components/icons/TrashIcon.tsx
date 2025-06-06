import { FC } from 'react';

interface TrashIconProps extends React.SVGProps<SVGSVGElement> {
  pathClassName?: string;
}

const TrashIcon: FC<TrashIconProps> = ({ pathClassName, ...svgProps }) => {
  return (
    <svg
      width="19"
      height="20"
      viewBox="0 0 23 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...svgProps}
    >
      <path
        className={pathClassName}
        d="M4.31825 21.9396L2.3 7.2H20.7L18.6818 21.9396C18.6034 22.5115 18.33 23.0347 17.9117 23.4132C17.4935 23.7917 16.9584 24 16.4047 24H6.59525C6.04161 24 5.50654 23.7917 5.08827 23.4132C4.66999 23.0347 4.39659 22.5115 4.31825 21.9396ZM21.85 2.4H16.1V1.2C16.1 0.88174 15.9788 0.576515 15.7632 0.351472C15.5475 0.126428 15.255 0 14.95 0H8.05C7.745 0 7.45249 0.126428 7.23683 0.351472C7.02116 0.576515 6.9 0.88174 6.9 1.2V2.4H1.15C0.845001 2.4 0.552494 2.52643 0.336827 2.75147C0.12116 2.97652 0 3.28174 0 3.6C0 3.91826 0.12116 4.22348 0.336827 4.44853C0.552494 4.67357 0.845001 4.8 1.15 4.8H21.85C22.155 4.8 22.4475 4.67357 22.6632 4.44853C22.8788 4.22348 23 3.91826 23 3.6C23 3.28174 22.8788 2.97652 22.6632 2.75147C22.4475 2.52643 22.155 2.4 21.85 2.4Z"
        fill="black"
      />
    </svg>
  );
};

export default TrashIcon;
