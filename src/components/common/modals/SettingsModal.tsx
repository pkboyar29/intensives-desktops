import { FC, useState } from 'react';
import { toast } from 'react-toastify';
import { useAppSelector } from '../../../redux/store';
import { useToggleNotificationsMutation } from '../../../redux/api/userApi';

import Modal from './Modal';
import ChangePasswordForm from '../../forms/ChangePasswordForm';
import PrimaryButton from '../PrimaryButton';
import ToggleButton from '../ToggleButton';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: FC<SettingsModalProps> = ({ onClose }) => {
  const currentUser = useAppSelector((state) => state.user.data);

  const [toggleNotifications] = useToggleNotificationsMutation();

  const [changePasswordMode, setChangePasswordMode] = useState<boolean>(false);

  return (
    <>
      <Modal title="Настройки" onCloseModal={onClose}>
        <div className="text-lg text-bright_gray h-[60vh] overflow-y-auto flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-base sm:text-lg">Изменение пароля</p>

            {!changePasswordMode && (
              <div>
                <PrimaryButton
                  clickHandler={() => setChangePasswordMode(true)}
                  children="Изменить пароль"
                />
              </div>
            )}
          </div>
          {changePasswordMode && (
            <div className="mt-3">
              <ChangePasswordForm
                onChangePassword={() => {
                  toast('Пароль успешно изменен', {
                    type: 'success',
                  });
                  setChangePasswordMode(false);
                }}
                onError={() => {
                  toast('Произошла серверная ошибка при изменении пароля', {
                    type: 'error',
                  });
                }}
              />
            </div>
          )}
          <div className="border-b border-solid opacity-40 border-bright_gray"></div>
          <div className="flex items-center justify-between">
            <p className="text-base sm:text-lg">Не показывать уведомления</p>

            {currentUser && (
              <ToggleButton
                isChecked={currentUser.notificationDisabled}
                setIsChecked={async (isChecked) => {
                  const { error: responseError } = await toggleNotifications(
                    isChecked
                  );

                  if (responseError) {
                    toast(
                      'Произошла серверная ошибка при изменении показа уведомлений',
                      {
                        type: 'error',
                      }
                    );
                  }
                }}
              />
            )}
          </div>
          <div className="border-b border-solid opacity-40 border-bright_gray"></div>
          <div className="flex items-center justify-between">
            <p className="text-base sm:text-lg">Обратная связь</p>

            <div>
              <PrimaryButton
                clickHandler={() => console.log('ссылка на форму')}
                children={
                  <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSfp6VEuFBmzkhFUnEJmgdHjct8KujQP07U69emdyzPW7gdBeQ/viewform?usp=header"
                    target="_blank"
                  >
                    Сообщить об ошибке
                  </a>
                }
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SettingsModal;
