import { FC, useState } from 'react';

type EvaluationElemProps = {
  id: number;
  name: string;
  role: string;
  currentEvaluate: number;
  changeEvaluate: (id: number, evaluate: number) => void;
};

const EvaluationElem: FC<EvaluationElemProps> = ({
  id,
  name,
  role,
  currentEvaluate,
  changeEvaluate,
}) => {
  const [evaluate, setEvaluate] = useState<number>(currentEvaluate);

  function minusEvaluate() {
    console.log('minus');
    if (evaluate > 2) setEvaluate(evaluate - 1);
    changeEvaluate(id, evaluate);
  }

  function plusEvaluate() {
    if (evaluate < 5) setEvaluate(evaluate + 1);
    changeEvaluate(id, evaluate);
  }

  return (
    <div className="flex justify-between p-5 bg-gray">
      <div className="flex flex-col space-y-3">
        <p>{name}</p>
        <p>{role}</p>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={plusEvaluate}
          className="px-3 py-3 bg-white rounded-full"
        >
          +
        </button>
        <p>{evaluate == null ? currentEvaluate : evaluate}</p>
        <button
          onClick={minusEvaluate}
          className="px-3 py-3 bg-white rounded-full"
        >
          -
        </button>
      </div>
    </div>
  );
};

export default EvaluationElem;
