import { FC } from 'react';

const SubmitIcon: FC<React.SVGProps<SVGSVGElement>> = (props) => {
  const strokeStyle = {
    fill: 'none',
    stroke: '#000000',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeMiterlimit: 10,
  };

  return (
    <svg
      {...props}
      version="1.1"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <line x1="16" y1="20" x2="16" y2="4" style={strokeStyle} />
      <polyline points="12,8 16,4 20,8" style={strokeStyle} />
      <polyline
        points="9,13 3,16.5 3,21.5 16,29 29,21.5 29,16.5 23,13"
        style={strokeStyle}
      />
    </svg>
  );
};

export default SubmitIcon;
