import { FC, ButtonHTMLAttributes, ReactNode } from 'react';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  buttonColor?: 'blue' | 'gray';
  clickHandler?: () => void;
}

const PrimaryButton: FC<PrimaryButtonProps> = ({
  children,
  buttonColor = 'blue',
  clickHandler,
  type,
  ...props
}) => {
  return (
    <button
      className={`${
        buttonColor === 'blue'
          ? 'text-white font-semibold bg-blue hover:bg-dark_blue'
          : 'text-black font-bold bg-another_white hover:bg-black_gray'
      } px-4 py-2 text-lg rounded-[10px] w-full flex justify-center items-center transition duration-300 ease-in-out`}
      onClick={clickHandler}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
