import { FC } from 'react';
import { useAppSelector, useAppDispatch } from '../redux/store';
import { setTeam } from '../redux/slices/teamSlice';
import { isUserTutor } from '../helpers/userHelpers';

import TeamIcon from './icons/TeamIcon';
import EnterIcon from './icons/EnterIcon';
import Tag from './common/Tag';
import Chip from './common/Chip';
import Tooltip from './common/Tooltip';

import { ITeam } from '../ts/interfaces/ITeam';

interface TeamCardProps {
  team: ITeam;
}

const TeamCard: FC<TeamCardProps> = ({ team }) => {
  const currentUser = useAppSelector((state) => state.user.data);
  const dispatch = useAppDispatch();

  const onEnterButtonClick = (team: ITeam) => {
    localStorage.setItem('tutorTeamId', team.id.toString());
    dispatch(setTeam(team));
  };

  return (
    <div className="flex-shrink flex-grow-0 basis-[250px] flex flex-col gap-3">
      <div className="flex justify-between gap-2">
        <div className="flex gap-2">
          <div className="transition duration-300 flex items-center justify-center bg-gray_5 hover:bg-gray_6 rounded-[10px] w-12 h-12">
            <TeamIcon />
          </div>
          <h3 className="text-lg">{team.name}</h3>
        </div>

        {isUserTutor(currentUser, team) && (
          <Tooltip
            tooltipText="Войти как тьютор"
            tooltipClasses="bg-gray_5 p-1 rounded"
          >
            <button
              onClick={() => onEnterButtonClick(team)}
              className="transition duration-300 flex items-center justify-center bg-gray_5 hover:bg-gray_6 rounded-[10px] w-12 h-12 cursor-pointer"
            >
              <EnterIcon />
            </button>
          </Tooltip>
        )}
      </div>

      {team.tutor && (
        <div className="flex gap-3 h-9">
          <div className="flex items-center justify-center p-3 text-base font-bold leading-none rounded-lg w-9 bg-gray_5">
            Т
          </div>
          {/* <Chip label={team.tutor.name} /> */}
          <Tag content={team.tutor.name} shouldHaveCrossIcon={false} />
        </div>
      )}

      {team.mentor && (
        <div className="flex gap-3 h-9">
          <div className="flex items-center justify-center p-3 text-base font-bold leading-none rounded-lg w-9 bg-gray_5">
            Н
          </div>
          {/* <Chip label={team.mentor.nameWithGroup} /> */}
          <Tag
            content={team.mentor.nameWithGroup}
            shouldHaveCrossIcon={false}
          />
        </div>
      )}

      {team.teamlead && (
        <div className="flex gap-3 h-9">
          <div className="flex items-center justify-center p-3 text-base font-bold leading-none rounded-lg w-9 bg-gray_5">
            ТЛ
          </div>
          {/* <Chip label={team.teamlead.nameWithGroup} /> */}
          <Tag
            content={team.teamlead.nameWithGroup}
            shouldHaveCrossIcon={false}
          />
        </div>
      )}

      {!team.tutor && <div className="text-bright_gray">Нет тьютора</div>}
      {!team.mentor && <div className="text-bright_gray">Нет наставника</div>}
      {!team.teamlead && <div className="text-bright_gray">Нет тимлида</div>}

      <div className="flex flex-col gap-3">
        {team.studentsInTeam.length > 0 ? (
          team.studentsInTeam
            .filter(
              (studentInTeam) => team.teamlead?.id !== studentInTeam.student.id
            )
            .map((studentInTeam) => (
              // <Chip
              //   key={studentInTeam.id}
              //   label={studentInTeam.nameWithGroup}
              // />
              <Tag
                key={studentInTeam.student.id}
                content={studentInTeam.student.nameWithGroup}
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
