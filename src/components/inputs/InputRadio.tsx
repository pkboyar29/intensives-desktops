import { FC, ReactNode } from 'react';
import { UseFormRegister } from 'react-hook-form';

interface InputRadioProps {
  register: UseFormRegister<any>;
  value: string;
  currentValue: string;
  fieldName: string;
  description: string;
  children?: ReactNode;
}

const InputRadio: FC<InputRadioProps> = ({
  register,
  value,
  currentValue,
  description,
  fieldName,
  children,
}) => {
  return (
    <>
      <label className="flex items-center gap-3 px-6 py-4 text-lg border cursor-pointer select-none rounded-xl border-another_white">
        <input {...register(fieldName)} type="radio" value={value} />

        <p>{description}</p>
      </label>

      {currentValue === value && children && (
        <div className="flex flex-col gap-3 ml-10">{children}</div>
      )}
    </>
  );
};

export default InputRadio;
