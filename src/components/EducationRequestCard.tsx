import { FC } from 'react';
import { useAppSelector } from '../redux/store';
import { isUserManager, isUserTeamlead } from '../helpers/userHelpers';
import { getRussianDateDisplay } from '../helpers/dateHelpers';

import CrossIcon from './icons/CrossIcon';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';
import EnterIcon from './icons/EnterIcon';

import { IEducationRequest } from '../ts/interfaces/IEducationRequest';

interface EducationRequestCardProps {
  educationRequest: IEducationRequest;
  onEditButtonClick: (request: IEducationRequest) => void;
  onDeleteButtonClick: (deletedRequest: IEducationRequest) => void;
  onChangeStatusButtonClick: (request: IEducationRequest) => void;
  onAnswerButtonClick: (request: IEducationRequest) => void;
}

const EducationRequestCard: FC<EducationRequestCardProps> = ({
  educationRequest,
  onEditButtonClick,
  onDeleteButtonClick,
  onChangeStatusButtonClick,
  onAnswerButtonClick,
}) => {
  const currentUser = useAppSelector((state) => state.user.data);
  const currentTeam = useAppSelector((state) => state.team.data);

  const buttonStyles =
    'p-1.5 h-7 flex gap-2 justify-center items-center rounded-lg text-[14px] select-none border border-solid border-black whitespace-nowrap cursor-pointer transition duration-300 ease-in-out hover:bg-black_gray';

  return (
    <div className="p-2 border border-solid min-h-28 rounded-xl bg-gray_8 border-gray">
      <div className="flex flex-col-reverse justify-between gap-2 md:gap-8 md:flex-row min-h-28">
        <div className="md:w-2/3">
          <div className="text-lg font-bold md:text-xl">
            {educationRequest.subject}
          </div>
          {educationRequest.description && (
            <div className="mt-3 text-base break-words line-clamp-3 md:text-lg text-black_3">
              {educationRequest.description}
            </div>
          )}
        </div>

        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row md:items-end md:flex-col">
          <div className="flex flex-col gap-2.5 items-start md:items-end">
            {/* первый row */}
            <div className="flex items-center gap-3">
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
              {isUserManager(currentUser) && (
                <div className="p-1.5 h-7 flex justify-center items-center rounded-lg text-[14px] border border-solid border-black whitespace-nowrap">
                  {educationRequest.team.name}
                </div>
              )}
              <div className="p-1.5 h-7 flex items-center text-center gap-1.5 rounded-lg text-[14px] bg-gray_1 w-fit border border-solid border-black whitespace-nowrap">
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

            {/* второй row */}
            {isUserManager(currentUser) && (
              <button
                onClick={() => onChangeStatusButtonClick(educationRequest)}
                className="p-1.5 h-7 flex gap-2 justify-center items-center rounded-lg text-[14px] select-none border border-solid border-black 
                whitespace-nowrap cursor-pointer transition duration-300 ease-in-out hover:bg-black_gray"
              >
                {educationRequest.status === 'Открыт' ? (
                  <>
                    {' '}
                    <span>Закрыть</span>
                    <span>
                      <CrossIcon />
                    </span>
                  </>
                ) : (
                  <>
                    {' '}
                    <span>Открыть снова</span>
                  </>
                )}
              </button>
            )}

            {/* третий row */}
            {isUserManager(currentUser) ? (
              <>
                <button
                  onClick={() => onAnswerButtonClick(educationRequest)}
                  className={buttonStyles}
                >
                  {educationRequest.answer ? (
                    <>
                      <span>Посмотреть ответ</span>
                      <span>
                        <EnterIcon className="w-[18px] h-[18px]" />
                      </span>
                    </>
                  ) : (
                    <>
                      <span>Отправить ответ</span>
                      <span>
                        <EnterIcon className="w-[18px] h-[18px]" />
                      </span>
                    </>
                  )}
                </button>
              </>
            ) : (
              educationRequest.answer && (
                <button
                  onClick={() => onAnswerButtonClick(educationRequest)}
                  className={buttonStyles}
                >
                  <span>Посмотреть ответ</span>
                  <span>
                    <EnterIcon className="w-[18px] h-[18px]" />
                  </span>
                </button>
              )
            )}
          </div>

          <div className="pb-2 text-black_3 whitespace-nowrap">
            {getRussianDateDisplay(educationRequest.createdDate)}
            {educationRequest.updatedDate > educationRequest.createdDate &&
              ', изм.'}{' '}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationRequestCard;
