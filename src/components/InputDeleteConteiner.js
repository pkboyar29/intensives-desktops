import { useState } from 'react';
import { InputDelete } from './InputDelete';

const InputDeleteConteiner = (props) => {
  const [values, setValues] = useState([{ id: '1' }]);
  const [count, setCount] = useState(2);

  const handlerAddValues = () => {
    setCount(count + 1);
    setValues([...values, { id: `${count}` }]);
  };

  const handlerDeleteValues = (value) => {
    setValues(values.filter((elem) => elem.id != value));
  };

  return (
    <>
      <div className="element-list-input">
        <div className="font-18 bold-font">Список критериев</div>
      </div>
      <div>
        {values.map((elem, index) => (
          <InputDelete
            key={elem.id}
            nameProp={elem.id}
            placeholderProp={'Критерий ' + (index + 1)}
            deleteProp={handlerDeleteValues}
          ></InputDelete>
        ))}
      </div>
      <button className="button-classic" onClick={handlerAddValues}>
        Добавить
      </button>
    </>
  );
};

export { InputDeleteConteiner };
