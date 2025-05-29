import { useGetTestsQuery, useDeleteTestMutation } from '../redux/api/testApi';
import PrimaryButton from '../components/common/PrimaryButton';
import Title from '../components/common/Title';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ConfirmDeleteModal from '../components/common/modals/ConfirmDeleteModal';

const TestsPage = () => {
  const {
    data: tests,
    isLoading,
    error,
  } = useGetTestsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const navigate = useNavigate();
  const [deletingTest, setDeletingTest] = useState<any | null>(null);
  const [deleteTest] = useDeleteTestMutation();
  const [refetching, setRefetching] = useState(false);

  const handleDelete = async () => {
    if (deletingTest) {
      await deleteTest(deletingTest.id);
      setDeletingTest(null);
      setRefetching(true);
    }
  };

  useEffect(() => {
    if (refetching) {
      // Принудительно обновить список тестов после удаления
      window.location.reload(); // или можно использовать refetch, если он есть
    }
  }, [refetching]);

  return (
    <div className="mt-[88px] min-h-screen overflow-y-auto max-w-[1280px] mx-auto px-4">
      <Title text="Список тестов" />
      <div className="flex justify-end mb-4">
        <div>
          <PrimaryButton
            children="Создать тест"
            clickHandler={() => {
              navigate('/createTestPage'); // переходим на страницу создания теста
            }}
          />
        </div>
      </div>
      {isLoading && <div>Загрузка...</div>}
      {error && <div>Ошибка загрузки</div>}
      {tests && tests.length === 0 && <div>Нет тестов</div>}
      {tests &&
        tests.map((test) => (
          <div key={test.id} className="p-4 mb-6 bg-white rounded shadow">
            <div className="font-semibold">{test.name}</div>
            <div className="text-gray-600">{test.description}</div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => navigate(`/tests/${test.id}`)}
                className="px-3 py-1 transition bg-blue-100 rounded text-blue hover:bg-blue-200"
              >
                Редактировать
              </button>
              <button
                onClick={() => setDeletingTest(test)}
                className="px-3 py-1 transition bg-red-100 rounded text-red hover:bg-red-200"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      {deletingTest && (
        <ConfirmDeleteModal
          onConfirm={handleDelete}
          onCancel={() => setDeletingTest(null)}
        />
      )}
    </div>
  );
};

export default TestsPage;
