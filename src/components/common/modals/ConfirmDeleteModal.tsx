import React from 'react';
import Modal from './Modal';
import PrimaryButton from '../PrimaryButton';

interface ConfirmDeleteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  onConfirm,
  onCancel,
  title = 'Удалить вопрос?',
  description = 'Вы точно хотите удалить этот вопрос?',
}) => (
  <Modal title={title} onCloseModal={onCancel}>
    <p className="text-lg">{description}</p>
    <div className="flex justify-end gap-3 mt-6">
      <PrimaryButton
        buttonColor="gray"
        clickHandler={onCancel}
        children="Отмена"
      />
      <PrimaryButton clickHandler={onConfirm} children="Удалить" />
    </div>
  </Modal>
);

export default ConfirmDeleteModal;
