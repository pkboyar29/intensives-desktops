import { FC } from 'react';

const UpArrowIcon: FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      fill="#000000"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      id="up-arrow"
      data-name="Flat Line"
      xmlns="http://www.w3.org/2000/svg"
      className="icon flat-line"
      {...props}
    >
      <line
        id="primary"
        x1="12"
        y1="21"
        x2="12"
        y2="3"
        style={{
          fill: 'none',
          stroke: 'rgb(0, 0, 0)',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: 2,
        }}
      ></line>
      <polyline
        id="primary-2"
        data-name="primary"
        points="15 6 12 3 9 6"
        style={{
          fill: 'none',
          stroke: 'rgb(0, 0, 0)',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: 2,
        }}
      ></polyline>
    </svg>
  );
};

export default UpArrowIcon;
