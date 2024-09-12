import { FC, useState } from 'react';
import InputRadio from './InputRadio';

interface InputRadioDescriptionProps {
  setTypeProp: any;
}

const InputRadioDescription: FC<InputRadioDescriptionProps> = ({
  setTypeProp,
}) => {
  const [activeRadio, setActiveRadio] = useState('');

  const handleRadioChange = (radioValue: any, valueType: any) => {
    setActiveRadio(radioValue);
    if (valueType === 'number') {
      setTypeProp(radioValue);
    }
  };

  return (
    <div className="element-list-input column-container">
      <InputRadio
        nameProp={'name'}
        activeProp={activeRadio}
        valueProp={1}
        descriptionProp={'Без оценивания'}
        funcProp={(value: any) => handleRadioChange(value, 'number')}
        isList={true}
      />
      <InputRadio
        nameProp={'name'}
        activeProp={activeRadio}
        valueProp={'label1'}
        descriptionProp={'Оценивание по шкале без критериев'}
        funcProp={handleRadioChange}
        isList={true}
        children={
          <>
            <InputRadio
              nameProp={'nameCh'}
              valueProp={6}
              descriptionProp={'Зачет/Незачет'}
              isList={true}
              funcProp={(value: any) => handleRadioChange(value, 'number')}
            />
            <InputRadio
              nameProp={'nameCh'}
              valueProp={3}
              isList={true}
              descriptionProp={'Пятибальная шкала'}
              funcProp={(value: any) => handleRadioChange(value, 'number')}
            />
            <InputRadio
              nameProp={'nameCh'}
              valueProp={5}
              isList={true}
              descriptionProp={'Стобальная шкала'}
              funcProp={(value: any) => handleRadioChange(value, 'number')}
            />
          </>
        }
      />
      <InputRadio
        nameProp={'name'}
        activeProp={activeRadio}
        valueProp={'label2'}
        isList={true}
        descriptionProp={'Оценивание по шкале с критериями'}
        funcProp={handleRadioChange}
        children={
          <>
            <InputRadio
              nameProp={'nameCh'}
              valueProp={6}
              isList={true}
              descriptionProp={'Зачет/Незачет'}
              funcProp={(value: any) => handleRadioChange(value, 'number')}
            />
            <InputRadio
              nameProp={'nameCh'}
              valueProp={3}
              isList={true}
              descriptionProp={'Пятибальная шкала'}
              funcProp={(value: any) => handleRadioChange(value, 'number')}
            />
            <InputRadio
              nameProp={'nameCh'}
              valueProp={5}
              isList={true}
              descriptionProp={'Стобальная шкала'}
              funcProp={(value: any) => handleRadioChange(value, 'number')}
            />
          </>
        }
      />
    </div>
  );
};

export default InputRadioDescription;
