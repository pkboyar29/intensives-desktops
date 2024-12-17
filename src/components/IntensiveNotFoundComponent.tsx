import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import PrimaryButton from './common/PrimaryButton';
import BackArrowIcon from './icons/BackArrowIcon';

const IntensiveNotFoundComponent: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-5 mt-20">
      <div className="text-2xl font-bold">
        Интенсива с данным id не существует
      </div>
      <div className="w-fit">
        <PrimaryButton
          buttonColor="gray"
          children={
            <div className="flex items-center gap-2">
              <BackArrowIcon />
              <p>Вернуться к списку интенсивов</p>
            </div>
          }
          onClick={() => {
            navigate(`/intensives`);
          }}
        />
      </div>
    </div>
  );
};

export default IntensiveNotFoundComponent;
