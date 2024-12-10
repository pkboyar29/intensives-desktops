import { FC, HTMLInputTypeAttribute } from 'react';
import { UseFormRegister, RegisterOptions } from 'react-hook-form';

interface InputDescriptionProps {
  register: UseFormRegister<any>;
  fieldName: string;
  registerOptions?: RegisterOptions;
  placeholder: string;
  description?: string;
  isTextArea?: boolean;
  errorMessage?: string;
  type?: HTMLInputTypeAttribute;
}

const InputDescription: FC<InputDescriptionProps> = ({
  register,
  fieldName,
  registerOptions,
  placeholder,
  description,
  isTextArea = false,
  errorMessage,
  type,
}) => {
  return (
    <div className="flex flex-col w-full gap-2 text-lg">
      <label>{description}</label>

      {!isTextArea ? (
        <input
          type={type ? type : 'text'}
          placeholder={placeholder}
          {...register(fieldName, registerOptions)}
          className="p-2.5 rounded-[10px] bg-another_white text-bright_gray"
        />
      ) : (
        <textarea
          placeholder={placeholder}
          className="p-2.5 rounded-[10px] bg-another_white text-bright_gray h-28"
          {...register(fieldName, registerOptions)}
        />
      )}

      {errorMessage && <div className="text-base text-red">{errorMessage}</div>}
    </div>
  );
};

export default InputDescription;