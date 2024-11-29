import { FC } from 'react';
import { RegisterOptions, UseFormRegister } from 'react-hook-form';

interface SelectProps {
  fieldName: string;
  register: UseFormRegister<any>;
  registerOptions?: RegisterOptions;
  options: {
    id: number;
    name: string;
  }[];
  initialText: string;
  errorMessage?: string;
}

const Select: FC<SelectProps> = ({
  options,
  initialText,
  fieldName,
  register,
  registerOptions,
  errorMessage,
}) => {
  return (
    <div className="flex flex-col w-full gap-2">
      <select
        {...register(fieldName, registerOptions)}
        className="p-2.5 text-lg rounded-[10px] bg-another_white"
      >
        <option key={0} value={0}>
          {initialText}
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>

      {errorMessage && <div className="text-base text-red">{errorMessage}</div>}
    </div>
  );
};

export default Select;
