import { useState } from 'react'
import { InputRadio } from './InputRadio'

const InputRadioDescription = (props) => {
  const [activeRadio, setActiveRadio] = useState('')

  const handleRadioChange = (radioValue, valueType) => {
    setActiveRadio(radioValue)
    if (valueType === 'number') {
      props.setTypeProp(radioValue)
    }
  }

  return (
    <div className='element-list-input column-container'>
      <div className=''>{props.descriptionProp}</div>
      <InputRadio
        nameProp={'name'}
        activeProp={activeRadio}
        valueProp={1}
        descriptionProp={'Без оценивания'}
        funcProp={(value) => handleRadioChange(value, 'number')}
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
              funcProp={(value) => handleRadioChange(value, 'number')}
            />
            <InputRadio
              nameProp={'nameCh'}
              valueProp={3}
              isList={true}
              descriptionProp={'Пятибальная шкала'}
              funcProp={(value) => handleRadioChange(value, 'number')}
            />
            <InputRadio
              nameProp={'nameCh'}
              valueProp={5}
              isList={true}
              descriptionProp={'Стобальная шкала'}
              funcProp={(value) => handleRadioChange(value, 'number')}
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
              funcProp={(value) => handleRadioChange(value, 'number')}
            />
            <InputRadio
              nameProp={'nameCh'}
              valueProp={3}
              isList={true}
              descriptionProp={'Пятибальная шкала'}
              funcProp={(value) => handleRadioChange(value, 'number')}
            />
            <InputRadio
              nameProp={'nameCh'}
              valueProp={5}
              isList={true}
              descriptionProp={'Стобальная шкала'}
              funcProp={(value) => handleRadioChange(value, 'number')}
            />
          </>
        } />
    </div>
  )
}

export { InputRadioDescription }