import { FC } from 'react';

const SearchIcon: FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      className="absolute transform -translate-y-1/2 left-2 top-1/2"
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.0306 18.9694L15.3366 14.2762C18.1629 10.883 17.8204 5.86693 14.5591 2.88935C11.2978 -0.0882368 6.27134 0.0259986 3.14867 3.14867C0.0259986 6.27134 -0.0882368 11.2978 2.88935 14.5591C5.86693 17.8204 10.883 18.1629 14.2762 15.3366L18.9694 20.0306C19.2624 20.3237 19.7376 20.3237 20.0306 20.0306C20.3237 19.7376 20.3237 19.2624 20.0306 18.9694ZM2.25 9C2.25 5.27208 5.27208 2.25 9 2.25C12.7279 2.25 15.75 5.27208 15.75 9C15.75 12.7279 12.7279 15.75 9 15.75C5.27379 15.7459 2.25413 12.7262 2.25 9Z"
        fill="#637087"
      />
    </svg>
  );
};

export default SearchIcon;
