import { FC } from 'react';

interface EditIconProps extends React.SVGProps<SVGSVGElement> {
  // width?: number;
  // height?: number;
}

const EditIcon: FC<EditIconProps> = ({ ...svgProps }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width="19"
      height="20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 23 24"
      {...svgProps}
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
};

export default EditIcon;
