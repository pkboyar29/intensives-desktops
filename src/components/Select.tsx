import { FC } from 'react';
import { UseFormRegister } from 'react-hook-form';

interface SelectProps {
  fieldName: string;
  register: UseFormRegister<any>;
  options: {
    id: number;
    name: string;
  }[];
  initialText: string;
}

const Select: FC<SelectProps> = ({
  options,
  initialText,
  fieldName,
  register,
}) => {
  return (
    <select
      {...register(fieldName)}
      className="p-2.5 w-full text-lg rounded-[10px] bg-[#f0f2f5]"
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
  );
};

export default Select;
