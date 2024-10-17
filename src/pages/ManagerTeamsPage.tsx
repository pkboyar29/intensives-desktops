import { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Title from '../components/Title';
import PrimaryButton from '../components/PrimaryButton';
import TeamIcon from '../components/icons/TeamIcon';

const ManagerTeamsPage: FC = () => {
  const navigate = useNavigate();
  const { intensiveId } = useParams();

  return (
    <div>
      <Title text="Команды" />

      <h2 className="text-lg font-bold mt-7">Созданные команды</h2>

      <div className="flex flex-wrap gap-6 mt-7">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index}>
            <div className="flex gap-2 transition duration-300 group">
              <TeamIcon />
              <h3 className="text-lg">Команда {index}</h3>
            </div>

            <div className="flex flex-col gap-5 mt-3">
              {Array.from({ length: 6 }).map((_, innerIndex) => (
                <span
                  key={innerIndex}
                  className="px-4 py-[5.5px] bg-gray_5 rounded-xl hover:bg-gray_6"
                >
                  20-ИСбо-2 Мындрила М.А.
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-5 mt-10">
        <div>
          <PrimaryButton
            text="Изменить состав команд"
            clickHandler={() => navigate(`/manager/${intensiveId}/createTeams`)}
          />
        </div>
        <div>
          <PrimaryButton
            text="Изменить команды сопровождения"
            clickHandler={() => console.log('yes')}
          />
        </div>
      </div>
    </div>
  );
};

export default ManagerTeamsPage;
