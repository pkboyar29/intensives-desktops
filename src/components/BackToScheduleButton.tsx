import { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import PrimaryButton from './common/PrimaryButton';
import BackArrowIcon from './icons/BackArrowIcon';

const BackToScheduleButton: FC = () => {
  const navigate = useNavigate();
  const params = useParams();

  return (
    <div>
      <PrimaryButton
        buttonColor="gray"
        children={
          <div className="flex items-center gap-2">
            <BackArrowIcon />
            <p>Назад</p>
          </div>
        }
        onClick={() => {
          navigate(`/intensives/${params.intensiveId}/schedule`);
        }}
      />
    </div>
  );
};

export default BackToScheduleButton;
