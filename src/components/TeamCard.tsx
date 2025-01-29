import { FC } from 'react';
import { ITeam } from '../ts/interfaces/ITeam';

import { useAppSelector } from '../redux/store';

import TeamIcon from './icons/TeamIcon';
import EnterIcon from './icons/EnterIcon';
import Tag from './common/Tag';
import Tooltip from './common/Tooltip';

interface TeamCardProps {
  team: ITeam;
}

const TeamCard: FC<TeamCardProps> = ({ team }) => {
  const currentUser = useAppSelector((state) => state.user.data);

  return (
    <div className="flex-shrink flex-grow-0 basis-[250px] flex flex-col gap-3">
      <div className="flex justify-between gap-2">
        <div className="flex gap-2">
          <div className="transition duration-300 flex items-center justify-center bg-gray_5 hover:bg-gray_6 rounded-[10px] w-12 h-12">
            <TeamIcon />
          </div>
          <h3 className="text-lg">{team.name}</h3>
        </div>

        {currentUser &&
          currentUser.roleNames.includes('Преподаватель') &&
          currentUser.teacher_id === team.tutor?.id && (
            <Tooltip
              tooltipText="Войти как тьютор"
              tooltipClasses="bg-gray_5 p-1 rounded"
            >
              <div className="transition duration-300 flex items-center justify-center bg-gray_5 hover:bg-gray_6 rounded-[10px] w-12 h-12 cursor-pointer">
                <EnterIcon />
              </div>
            </Tooltip>
          )}
      </div>

      {team.tutor && (
        <div className="flex gap-3 h-9">
          <div className="flex items-center justify-center p-3 text-base font-bold leading-none rounded-lg w-9 bg-gray_5">
            Т
          </div>
          <Tag content={team.tutor.name} shouldHaveCrossIcon={false} />
        </div>
      )}

      {team.mentor && (
        <div className="flex gap-3 h-9">
          <div className="flex items-center justify-center p-3 text-base font-bold leading-none rounded-lg w-9 bg-gray_5">
            Н
          </div>
          <Tag
            content={team.mentor.nameWithGroup}
            shouldHaveCrossIcon={false}
          />
        </div>
      )}

      {!team.tutor && <div className="text-bright_gray">Нет тьютора</div>}
      {!team.mentor && <div className="text-bright_gray">Нет наставника</div>}

      <div className="flex flex-col gap-3">
        {team.studentsInTeam.length > 0 ? (
          team.studentsInTeam.map((studentInTeam) => (
            <Tag
              key={studentInTeam.id}
              content={studentInTeam.nameWithGroup}
              shouldHaveCrossIcon={false}
            />
          ))
        ) : (
          <div className="text-bright_gray">Нет участников</div>
        )}
      </div>
    </div>
  );
};

export default TeamCard;
