import { FC, ReactNode } from 'react';

interface InputRadioProps {
  value: string;
  currentValue: string;
  description: string;
  onChange: (value: string) => void;
  children?: ReactNode;
}

const InputRadio: FC<InputRadioProps> = ({
  value,
  currentValue,
  description,
  onChange,
  children,
}) => {
  return (
    <>
      <label className="flex items-center gap-3 px-6 py-4 text-lg border cursor-pointer select-none rounded-xl border-another_white">
        <input
          type="radio"
          value={value}
          checked={currentValue === value}
          onChange={() => onChange(value)}
        />

        <p>{description}</p>
      </label>

      {currentValue === value && children && (
        <div className="flex flex-col gap-3 ml-10">{children}</div>
      )}
    </>
  );
};

export default InputRadio;
