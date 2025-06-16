import React, { useState } from 'react';
import Modal from '../modals/Modal';
import PrimaryButton from '../PrimaryButton';
import { useGetTestsQuery } from '../../../redux/api/testApi';

interface AttachTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAttach: (data: { testId: number; startDate: string; endDate: string; attempts: number }) => void;
  attachedTestIds?: number[]; // id уже прикреплённых тестов
}

const AttachTestModal: React.FC<AttachTestModalProps> = ({ isOpen, onClose, onAttach, attachedTestIds = [] }) => {
  const { data: tests, isLoading } = useGetTestsQuery();
  const [selectedTest, setSelectedTest] = useState<number | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [attempts, setAttempts] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Сброс полей при каждом открытии модалки
  React.useEffect(() => {
    if (isOpen) {
      setSelectedTest(null);
      setStartDate('');
      setEndDate('');
      setAttempts(1);
      setError(null);
    }
  }, [isOpen]);

  const handleAttach = () => {
    setError(null);
    if (!selectedTest) {
      setError('Выберите тест');
      return;
    }
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
    onAttach({ testId: selectedTest, startDate, endDate, attempts });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      title="Прикрепить тест"
      onCloseModal={onClose}
      shouldHaveCrossIcon={true}
    >
      <div className="mb-5">
        <label className="block mb-2 text-lg font-semibold text-gray-700">Тест</label>
        <select
          className="w-full px-4 py-2 text-lg border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={selectedTest ?? ''}
          onChange={e => setSelectedTest(Number(e.target.value))}
        >
          <option value="">Выберите тест</option>
          {tests && tests
            .filter((test: any) => !attachedTestIds.includes(test.id))
            .map((test: any) => (
              <option key={test.id} value={test.id}>{test.name}</option>
            ))}
        </select>
      </div>
      <div className="mb-5">
        <label className="block mb-2 text-lg font-semibold text-gray-700">Дата начала</label>
        <input
          type="datetime-local"
          className="w-full px-4 py-2 text-lg border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />
      </div>
      <div className="mb-5">
        <label className="block mb-2 text-lg font-semibold text-gray-700">Дата окончания</label>
        <input
          type="datetime-local"
          className="w-full px-4 py-2 text-lg border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label className="block mb-2 text-lg font-semibold text-gray-700">Попытки</label>
        <input
          type="number"
          min={1}
          className="w-full px-4 py-2 text-lg border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={attempts}
          onChange={e => setAttempts(Number(e.target.value))}
        />
      </div>
      {error && (
        <div className="text-base text-red">{error}</div>
      )}
      <div className="flex justify-end gap-4 mt-6">
        <PrimaryButton type="button" clickHandler={handleAttach}>
          Сохранить
        </PrimaryButton>
      </div>
    </Modal>
  );
};

export default AttachTestModal;
