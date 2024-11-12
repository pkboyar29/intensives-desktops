import { FC, useState } from 'react';

import { useGetMarkStrategiesQuery } from '../../redux/api/markStrategyApi';
import { useGetCriteriasQuery } from '../../redux/api/criteriaApi';

import InputRadio from './InputRadio';
import MultipleSelectInput from './MultipleSelectInput';

// какой-то пропс изменения score type?
// TODO: start getting criterias from api
interface ScoreTypeBoxProps {}

const ScoreTypeBox: FC<ScoreTypeBoxProps> = () => {
  const { data: markStrategies } = useGetMarkStrategiesQuery();
  const { data: criterias } = useGetCriteriasQuery();

  // TODO: set default current value
  const [currentMarkStrategy, setCurrentMarkStrategy] = useState<string>('');
  // TODO: state for selected criterias

  const [currentScoreType, setCurrentScoreType] = useState<
    'withoutMarkStrategy' | 'withMarkStrategy' | 'withCriterias'
  >('withoutMarkStrategy');

  return (
    <div className="flex flex-col gap-3">
      <InputRadio
        value="withoutMarkStrategy"
        currentValue={currentScoreType}
        description="Без оценивания"
        onChange={(value) =>
          setCurrentScoreType(value as 'withoutMarkStrategy')
        }
      />
      <InputRadio
        value="withMarkStrategy"
        currentValue={currentScoreType}
        description="Оценивание по шкале"
        onChange={(value) => setCurrentScoreType(value as 'withMarkStrategy')}
      >
        {markStrategies?.map((markStrategy) => (
          <InputRadio
            key={markStrategy.id}
            value={markStrategy.id.toString()}
            currentValue={currentMarkStrategy}
            description={markStrategy.name}
            onChange={(value) => setCurrentMarkStrategy(value)}
          />
        ))}
      </InputRadio>
      <InputRadio
        value="withCriterias"
        currentValue={currentScoreType}
        description="Оценивание по шкале с критериями"
        onChange={(value) => setCurrentScoreType(value as 'withCriterias')}
      >
        {markStrategies?.map((markStrategy) => (
          <InputRadio
            key={markStrategy.id}
            value={markStrategy.id.toString()}
            currentValue={currentMarkStrategy}
            description={markStrategy.name}
            onChange={(value) => setCurrentMarkStrategy(value)}
          />
        ))}

        {criterias && (
          <div className="mt-3">
            <MultipleSelectInput
              description="Список критериев"
              items={criterias}
              selectedItems={[]}
              setSelectedItems={() => {}}
            />
          </div>
        )}
      </InputRadio>
    </div>
  );
};

export default ScoreTypeBox;
