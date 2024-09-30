import { FC, HTMLInputTypeAttribute } from 'react';
import { UseFormRegister, RegisterOptions } from 'react-hook-form';

interface InputDescriptionProps {
  register: UseFormRegister<any>;
  fieldName: string;
  registerOptions?: RegisterOptions;
  placeholder: string;
  description: string;
  errorMessage?: string;
  type?: HTMLInputTypeAttribute;
}

const InputDescription: FC<InputDescriptionProps> = ({
  fieldName,
  register,
  placeholder,
  description,
  registerOptions,
  errorMessage,
  type,
}) => {
  return (
    <div className="flex flex-col w-full gap-2 my-3 text-lg">
      <div>{description}</div>
      <input
        type={type ? type : 'text'}
        placeholder={placeholder}
        {...register(fieldName, registerOptions)}
        className="p-2.5 rounded-[10px] bg-[#f0f2f5]"
      />
      {errorMessage && <div className="text-base text-red">{errorMessage}</div>}
    </div>
  );
};

export default InputDescription;
