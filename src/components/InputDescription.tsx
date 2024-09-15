import { FC, HTMLInputTypeAttribute } from 'react';
import { UseFormRegister } from 'react-hook-form';

interface InputDescriptionProps {
  fieldName: string;
  register: UseFormRegister<any>;
  placeholder: string;
  description: string;
  type?: HTMLInputTypeAttribute;
}

const InputDescription: FC<InputDescriptionProps> = ({
  fieldName,
  register,
  placeholder,
  description,
  type,
}) => {
  return (
    <div className="flex flex-col w-full gap-2 my-3 text-lg">
      <div>{description}</div>
      <input
        type={type ? type : 'text'}
        placeholder={placeholder}
        {...register(fieldName)}
        className="p-2.5 rounded-[10px] bg-[#f0f2f5]"
      />
    </div>
  );
};

export default InputDescription;
