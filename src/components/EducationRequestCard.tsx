import { FC } from 'react';
import { useAppSelector } from '../redux/store';
import { isUserManager, isUserTeamlead } from '../helpers/userHelpers';
import { getRussianDateDisplay } from '../helpers/dateHelpers';

import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';

import { IEducationRequest } from '../ts/interfaces/IEducationRequest';

interface EducationRequestCardProps {
  educationRequest: IEducationRequest;
  onEditButtonClick: (request: IEducationRequest) => void;
  onDeleteButtonClick: (deletedRequest: IEducationRequest) => void;
}

const EducationRequestCard: FC<EducationRequestCardProps> = ({
  educationRequest,
  onEditButtonClick,
  onDeleteButtonClick,
}) => {
  const currentUser = useAppSelector((state) => state.user.data);
  const currentTeam = useAppSelector((state) => state.team.data);

  return (
    <div className="p-2 border border-solid min-h-28 rounded-xl bg-gray_8 border-gray">
      <div className="flex flex-col-reverse justify-between gap-2 md:gap-8 md:flex-row min-h-28">
        <div>
          <div className="text-lg font-bold md:text-xl">
            {educationRequest.subject}
          </div>
          {educationRequest.description && (
            <div className="mt-3 text-base md:text-lg text-black_3">
              {educationRequest.description}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end justify-between gap-2 sm:flex-row md:flex-col">
          <div className="flex gap-3">
            {isUserManager(currentUser) && (
              <div className="p-1.5 h-7 flex justify-center items-center rounded-lg text-[14px] select-none border border-solid border-black whitespace-nowrap">
                {educationRequest.team.name}
              </div>
            )}
            {isUserTeamlead(currentUser, currentTeam) && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onEditButtonClick(educationRequest)}
                  className="p-1.5 transition duration-300 ease-in-out cursor-pointer hover:bg-black_gray rounded-[10px]"
                >
                  <EditIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDeleteButtonClick(educationRequest)}
                  className="p-1.5 transition duration-300 ease-in-out cursor-pointer hover:bg-black_gray rounded-[10px]"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="p-1.5 h-7 flex items-center text-center gap-1.5 rounded-lg text-[14px] bg-gray_1 select-none w-fit border border-solid border-black whitespace-nowrap">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  educationRequest.status === 'Открыт'
                    ? 'bg-green-500'
                    : 'bg-red'
                }`}
              />
              <span>{educationRequest.status}</span>
            </div>{' '}
          </div>

          <div className="pb-2 text-black_3 whitespace-nowrap">
            {getRussianDateDisplay(educationRequest.createdDate)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationRequestCard;
