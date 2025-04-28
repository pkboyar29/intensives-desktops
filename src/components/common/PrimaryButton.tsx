import { FC, ButtonHTMLAttributes, ReactNode } from 'react';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  buttonColor?: 'blue' | 'gray' | 'red';
  clickHandler?: () => void;
}

const PrimaryButton: FC<PrimaryButtonProps> = ({
  children,
  buttonColor = 'blue',
  clickHandler,
  type,
  className,
  ...props
}) => {
  return (
    <button
      className={`${
        buttonColor === 'blue'
          ? 'text-white font-semibold bg-blue hover:bg-dark_blue disabled:bg-dark_blue'
          : buttonColor === 'gray'
          ? 'text-black font-bold bg-another_white hover:bg-black_gray'
          : 'text-white font-bold bg-red hover:bg-dark_red'
      } px-2 md:px-4 py-2 text-base md:text-lg rounded-[10px] w-full flex justify-center items-center transition duration-300 ease-in-out ${className}`}
      onClick={clickHandler}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
