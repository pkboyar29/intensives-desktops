import { FC } from 'react';

const DownArrowIcon: FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      fill="#000000"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      id="down-arrow"
      xmlns="http://www.w3.org/2000/svg"
      className="icon line"
      {...props}
    >
      <path
        id="primary"
        d="M12,3V21M9,18l3,3,3-3"
        style={{
          fill: 'none',
          stroke: 'rgb(0, 0, 0)',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: 1.5,
        }}
      ></path>
    </svg>
  );
};

export default DownArrowIcon;
