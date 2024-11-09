import { FC, useState } from 'react';
import InputRadio from './InputRadio';

interface InputRadioDescriptionProps {
  setType: any;
}

const InputRadioDescription: FC<InputRadioDescriptionProps> = ({ setType }) => {
  const [activeRadio, setActiveRadio] = useState('');

  const handleRadioChange = (radioValue: any, valueType: any) => {
    setActiveRadio(radioValue);
    if (valueType === 'number') {
      setType(radioValue);
    }
  };

  return (
    // этих стилей уже не существует
    <div className="element-list-input column-container">
      <InputRadio
        name={'name'}
        active={activeRadio}
        value={1}
        description={'Без оценивания'}
        func={(value: any) => handleRadioChange(value, 'number')}
        isList={true}
      />
      <InputRadio
        name={'name'}
        active={activeRadio}
        value={'label1'}
        description={'Оценивание по шкале без критериев'}
        func={handleRadioChange}
        isList={true}
        children={
          <>
            <InputRadio
              name={'nameCh'}
              value={6}
              description={'Зачет/Незачет'}
              isList={true}
              func={(value: any) => handleRadioChange(value, 'number')}
            />
            <InputRadio
              name={'nameCh'}
              value={3}
              isList={true}
              description={'Пятибальная шкала'}
              func={(value: any) => handleRadioChange(value, 'number')}
            />
            <InputRadio
              name={'nameCh'}
              value={5}
              isList={true}
              description={'Стобальная шкала'}
              func={(value: any) => handleRadioChange(value, 'number')}
            />
          </>
        }
      />
      <InputRadio
        name={'name'}
        active={activeRadio}
        value={'label2'}
        isList={true}
        description={'Оценивание по шкале с критериями'}
        func={handleRadioChange}
        children={
          <>
            <InputRadio
              name={'nameCh'}
              value={6}
              isList={true}
              description={'Зачет/Незачет'}
              func={(value: any) => handleRadioChange(value, 'number')}
            />
            <InputRadio
              name={'nameCh'}
              value={3}
              isList={true}
              description={'Пятибальная шкала'}
              func={(value: any) => handleRadioChange(value, 'number')}
            />
            <InputRadio
              name={'nameCh'}
              value={5}
              isList={true}
              description={'Стобальная шкала'}
              func={(value: any) => handleRadioChange(value, 'number')}
            />
          </>
        }
      />
    </div>
  );
};

export default InputRadioDescription;
