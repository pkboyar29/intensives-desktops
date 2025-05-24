import { FC, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

import Modal from './Modal';
import ChangePasswordForm from '../../forms/ChangePasswordForm';
import PrimaryButton from '../PrimaryButton';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: FC<SettingsModalProps> = ({ onClose }) => {
  const [changePasswordMode, setChangePasswordMode] = useState<boolean>(false);

  return (
    <>
      <ToastContainer position="top-center" />

      <Modal title="Настройки" onCloseModal={onClose}>
        <div className="text-lg text-bright_gray h-[60vh] overflow-y-auto flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p>Изменение пароля</p>

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
          <div className="mt-3 border-b border-solid opacity-40 border-bright_gray"></div>
          <div className="flex items-center justify-between">
            <p>Отключение уведомлений на почту</p>

            <input type="checkbox" />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SettingsModal;
