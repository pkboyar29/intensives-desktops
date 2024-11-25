import { FC } from 'react';

interface EyeIconProps extends React.SVGProps<SVGSVGElement> {
  eyeVisibility: boolean;
}

const EyeIcon: FC<EyeIconProps> = ({ eyeVisibility, ...props }) => {
  return (
    <svg
      width="19"
      height="12"
      viewBox="0 0 19 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M17.9 4.78429C14.6 0.184293 8.1 -0.915708 3.5 2.48429C2.3 3.38429 1.3 4.58429 0.5 5.88429C0.7 6.28429 1 6.68429 1.3 7.08429C4.6 11.6843 10.9 12.6843 15.5 9.48429C16.4 8.78429 17.2 8.08429 17.9 7.08429C18.2 6.68429 18.4 6.28429 18.7 5.88429C18.4 5.48429 18.2 5.08429 17.9 4.78429ZM9.7 2.48429C10.2 1.98429 11 1.98429 11.5 2.48429C12 2.98429 12 3.78429 11.5 4.28429C11 4.78429 10.2 4.78429 9.7 4.28429C9.2 3.78429 9.2 2.98429 9.7 2.48429ZM9.6 10.1843C6.5 10.1843 3.6 8.58429 1.9 5.98429C3.1 4.28429 4.7 3.08429 6.6 2.48429C5.9 3.28429 5.6 4.18429 5.6 5.18429C5.6 7.38429 7.3 9.28429 9.6 9.28429C11.8 9.28429 13.7 7.58429 13.7 5.28429V5.18429C13.7 4.18429 13.3 3.18429 12.6 2.48429C14.5 3.08429 16.1 4.28429 17.3 5.98429C15.6 8.58429 12.7 10.1843 9.6 10.1843Z"
        fill="black"
      />
      {eyeVisibility === false && (
        <line x1="1" y1="1" x2="18" y2="11" stroke="black" strokeWidth="1.5" />
      )}
    </svg>
  );
};

export default EyeIcon;
