import { FC } from 'react';

type PrimaryButtonProps = {
  text: string;
  width?: number;
  height?: number;
  onClick: () => void;
};

const PrimaryButton: FC<PrimaryButtonProps> = ({
  text,
  width,
  height,
  onClick,
}) => {
  return (
    <>
      <button
        className="px-5 py-3 text-white bg-blue font-l rounded-xl"
        onClick={onClick}
      >
        {text}
      </button>
    </>
  );
};

export default PrimaryButton;
