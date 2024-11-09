import { FC, ReactNode } from 'react';

interface InputRadioProps {
  value: number | string;
  func: any;
  name: string;
  description: string;
  isList?: boolean;
  active?: any;
  children?: ReactNode;
}

const InputRadio: FC<InputRadioProps> = ({
  value,
  func: funcProp,
  name: nameProp,
  description: descriptionProp,
  isList,
  active,
  children,
}) => {
  const func =
    value == 1 || value == 'label1' || value == 'label2'
      ? () => {
          funcProp(value);
        }
      : null;

  return (
    <div className="p-2.5 text-lg rounded-lg border border-another_white select-none">
      <input
        type="radio"
        name={nameProp}
        value={value}
        onChange={isList ? func : funcProp}
      />
      <label className="p-2">{descriptionProp}</label>

      <div
        className={
          children && active == value ? 'flex flex-col gap-3' : 'hidden'
        }
      >
        {children}
      </div>
    </div>
  );
};

export default InputRadio;
