import React from 'react';
import Modal from './Modal';
import PrimaryButton from '../PrimaryButton';

interface ConfirmDeleteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  onConfirm,
  onCancel,
}) => (
  <Modal title="Удалить вопрос?" onCloseModal={onCancel}>
    <p className="text-lg">Вы точно хотите удалить этот вопрос?</p>
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
