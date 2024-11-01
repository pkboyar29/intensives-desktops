import { FC } from 'react';

interface CaretIconProps extends React.SVGProps<SVGSVGElement> {
  isOpen?: boolean;
}

const CaretIcon: FC<CaretIconProps> = ({ isOpen = false, ...props }) => {
  return (
    <svg
      width="14"
      height="6"
      viewBox="0 0 15 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      style={{
        transform: isOpen ? `rotate(180deg)` : `rotate(0deg)`,
        transition: 'transform 0.2s ease-in-out',
      }}
    >
      <path
        d="M1.5 1L7.5 7L13.5 1"
        stroke="#000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CaretIcon;
