import React from 'react';
import Modal from '../modals/Modal';
import PrimaryButton from '../PrimaryButton';

interface EditAttachTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (values: { startDate: string; endDate: string; attempts: number }) => void;
  initial: any;
}

const EditAttachTestModal: React.FC<EditAttachTestModalProps> = ({ isOpen, onClose, onEdit, initial }) => {
  const [startDate, setStartDate] = React.useState(initial?.start_date ? initial.start_date.slice(0, 16) : '');
  const [endDate, setEndDate] = React.useState(initial?.end_date ? initial.end_date.slice(0, 16) : '');
  const [attempts, setAttempts] = React.useState(initial?.attempts_allowed || 1);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setStartDate(initial?.start_date ? initial.start_date.slice(0, 16) : '');
    setEndDate(initial?.end_date ? initial.end_date.slice(0, 16) : '');
    setAttempts(initial?.attempts_allowed || 1);
  }, [initial]);

  const handleSave = () => {
    setError(null);
    if (!startDate || !endDate) {
      setError('Укажите даты начала и окончания');
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      setError('Дата начала должна быть раньше даты окончания');
      return;
    }
    if (attempts < 1) {
      setError('Количество попыток должно быть не меньше 1');
      return;
    }
    onEdit({ startDate, endDate, attempts });
    onClose();
  };

  if (!isOpen) return null;
  return (
    <Modal
      title="Редактировать параметры теста"
      onCloseModal={onClose}
      shouldHaveCrossIcon={true}
    >
      <div className="mb-5">
        <label className="block mb-2 text-lg font-semibold">Дата начала</label>
        <input type="datetime-local" className="w-full px-4 py-2 text-lg border-2 rounded-lg focus:outline-none focus:ring-2" value={startDate} onChange={e => setStartDate(e.target.value)} />
      </div>
      <div className="mb-5">
        <label className="block mb-2 text-lg font-semibold">Дата окончания</label>
        <input type="datetime-local" className="w-full px-4 py-2 text-lg border-2 rounded-lg focus:outline-none focus:ring-2" value={endDate} onChange={e => setEndDate(e.target.value)} />
      </div>
      <div className="mb-6">
        <label className="block mb-2 text-lg font-semibold">Попытки</label>
        <input type="number" min={1} className="w-full px-4 py-2 text-lg border-2 rounded-lg focus:outline-none focus:ring-2" value={attempts} onChange={e => setAttempts(Number(e.target.value))} />
      </div>
      {error && (
        <div className="text-base text-red">{error}</div>
      )}
      <div className="flex justify-end gap-4 mt-6">
        <PrimaryButton type="button" clickHandler={handleSave}>
          Сохранить
        </PrimaryButton>
      </div>
    </Modal>
  );
};

export default EditAttachTestModal;
