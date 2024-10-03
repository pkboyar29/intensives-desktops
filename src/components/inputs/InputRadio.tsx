import { FC, ReactNode } from 'react';

interface InputRadioProps {
  valueProp: number | string;
  funcProp: any;
  nameProp: string;
  descriptionProp: string;
  isList?: boolean;
  activeProp?: any;
  children?: ReactNode;
}

const InputRadio: FC<InputRadioProps> = ({
  valueProp,
  funcProp,
  nameProp,
  descriptionProp,
  isList,
  activeProp,
  children,
}) => {
  const func =
    valueProp == 1 || valueProp == 'label1' || valueProp == 'label2'
      ? () => {
          funcProp(valueProp);
        }
      : null;

  return (
    <div className="p-2.5 text-lg rounded-lg border border-another_white select-none">
      <input
        type="radio"
        name={nameProp}
        value={valueProp}
        onChange={isList ? func : funcProp}
      />
      <label className="p-2">{descriptionProp}</label>

      <div
        className={
          children && activeProp == valueProp ? 'flex flex-col gap-3' : 'hidden'
        }
      >
        {children}
      </div>
    </div>
  );
};

export default InputRadio;
