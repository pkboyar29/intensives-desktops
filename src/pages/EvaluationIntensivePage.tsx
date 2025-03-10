import { FC, useEffect, useState } from 'react';
import Title from '../components/common/Title';
import EvaluationElem from '../components/EvaluationElem';

const EvaluationIntensivePage: FC = () => {
  function handleCurrentValue(id: number, evaluate: number) {}

  return (
    <div>
      <Title text="Оценка за интенсив" />
      <EvaluationElem
        id={1}
        name="Иванов И. И."
        role="Дизайнер"
        currentEvaluate={5}
        changeEvaluate={handleCurrentValue}
      />
    </div>
  );
};

export default EvaluationIntensivePage;
