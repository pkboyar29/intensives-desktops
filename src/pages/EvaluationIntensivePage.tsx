import { FC, useContext, useEffect, useState } from 'react';
import Title from '../components/Title';
import EvaluationElem from '../components/EvaluationElem';
import OverviewContent from '../components/OverviewContent';

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
