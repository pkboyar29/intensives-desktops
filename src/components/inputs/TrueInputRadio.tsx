import { FC } from 'react';
import { UseFormRegister } from 'react-hook-form';

// TODO: can I handle radio input using react hook form?

interface InputRadioProps {
  fieldName: string;
  register: UseFormRegister<any>;
}

const TrueInputRadio: FC<InputRadioProps> = ({ fieldName, register }) => {
  return (
    <input
      {...register(fieldName)}
      type="radio"
      className="px-5 py-4 border border-solid border-another_white rounded-xl"
    />
  );
};

export default TrueInputRadio;
