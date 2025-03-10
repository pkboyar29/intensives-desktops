import { FC } from 'react';

interface UserIconProps extends React.SVGProps<SVGSVGElement> {
  pathClassName?: string;
}

const UserIcon: FC<UserIconProps> = ({ pathClassName, ...svgProps }) => {
  return (
    <svg
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...svgProps}
    >
      <path
        className={pathClassName}
        d="M7.99977 7.25C5.72977 7.25 5.26977 3.81 5.26977 3.81C4.99977 2.02 5.81977 0 7.96977 0C10.1298 0 10.9498 2.02 10.6798 3.81C10.6798 3.81 10.2698 7.25 7.99977 7.25ZM7.96977 9.5C9.19307 9.49571 10.7198 8 10.7198 8C13.1098 8 15.2398 10.33 15.2398 12.53V15.02C15.2398 15.02 11.5898 16.15 7.99977 16.15C4.34977 16.15 0.759766 15.02 0.759766 15.02V12.53C0.759766 10.28 2.69977 8.05 5.22977 8.05C5.22977 8.05 6.75914 9.50425 7.96977 9.5Z"
        fill="black"
      />
    </svg>
  );
};

export default UserIcon;
