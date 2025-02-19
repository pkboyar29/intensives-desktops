import { FC, useState } from 'react';

import PrimaryButton from './common/PrimaryButton';
import UserIcon from './icons/UserIcon';

import { UserRole } from '../ts/interfaces/IUser';

interface ChoosingRoleComponentProps {
  rolesToChoose: UserRole[];
  onContinueButtonClick: (chosenRole: UserRole) => void;
}

const ChoosingRoleComponent: FC<ChoosingRoleComponentProps> = ({
  rolesToChoose,
  onContinueButtonClick,
}) => {
  const [chosenRole, setChosenRole] = useState<UserRole | null>(null);
  const [roleError, setRoleError] = useState<boolean>(false);

  const onRoleClick = (role: UserRole) => {
    setChosenRole(role);
    if (roleError === true) {
      setRoleError(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap justify-center gap-4">
        {rolesToChoose.map((roleToChoose, index) => (
          <div
            className={`group select-none flex flex-col gap-4 items-center justify-center text-lg transition duration-300 ease-in-out rounded-lg cursor-pointer w-36 h-36 hover:text-white bg-another_white hover:bg-blue ${
              roleToChoose === chosenRole && `border-solid border-2 border-blue`
            }`}
            key={index}
            onClick={() => onRoleClick(roleToChoose)}
          >
            <UserIcon
              className="w-10 h-10"
              pathClassName="transition duration-300 ease-in-out fill-black group-hover:fill-white"
            />
            <div>{roleToChoose.displayName}</div>
          </div>
        ))}
      </div>

      {roleError && (
        <div className="mx-auto text-base text-red">
          Необходимо выбрать роль
        </div>
      )}

      <PrimaryButton
        children="Продолжить"
        onClick={() => {
          if (chosenRole === null) {
            setRoleError(true);
            return;
          }

          onContinueButtonClick(chosenRole);
        }}
      />
    </div>
  );
};

export default ChoosingRoleComponent;
