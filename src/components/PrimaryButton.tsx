import { FC, ButtonHTMLAttributes } from 'react';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  clickHandler?: () => void;
}

const PrimaryButton: FC<PrimaryButtonProps> = ({
  text,
  clickHandler,
  type,
  ...props
}) => {
  return (
    <button
      className="px-4 py-[9px] text-white text-lg bg-blue hover:bg-dark_blue font-semibold rounded-[10px] w-full flex justify-center transition duration-300 ease-in-out"
      onClick={clickHandler}
      type={type}
      {...props}
    >
      {text}
    </button>
  );
};

export default PrimaryButton;
