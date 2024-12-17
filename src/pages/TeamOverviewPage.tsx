import { FC } from 'react';
import { useAppSelector } from '../redux/store';

import Title from '../components/common/Title';
import OverviewContent from '../components/OverviewContent';
import Skeleton from 'react-loading-skeleton';

const TeamOverviewPage: FC = () => {
  const currentTeam = useAppSelector((state) => state.team.data);

  return (
    <>
      {!currentTeam ? (
        <Skeleton />
      ) : (
        <>
          <Title text={currentTeam.name} />

          <div className="mt-5">
            <OverviewContent>
              <div className="font-sans text-xl font-bold text-black">
                Участники команды
              </div>
              <div className="flex flex-col gap-2">
                {currentTeam.studentsInTeam.map((studentInTeam) => (
                  <div
                    className="font-sans text-base text-bright_gray"
                    key={studentInTeam.id}
                  >
                    {studentInTeam.nameWithGroup}
                  </div>
                ))}
              </div>

              {currentTeam.mentor && (
                <div>
                  <h2 className="font-sans text-xl font-bold text-black">
                    Наставник
                  </h2>
                  <div className="mt-2 font-sans text-base text-bright_gray">
                    {currentTeam.mentor.nameWithGroup}
                  </div>
                </div>
              )}

              {currentTeam.tutor && (
                <div>
                  <h2 className="font-sans text-xl font-bold text-black">
                    Тьютор
                  </h2>
                  <div className="mt-2 font-sans text-base text-bright_gray">
                    {currentTeam.tutor.name}
                  </div>
                </div>
              )}
            </OverviewContent>
          </div>
        </>
      )}
    </>
  );
};

export default TeamOverviewPage;
