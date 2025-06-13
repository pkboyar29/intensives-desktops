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
      <div className="flex items-center justify-between mb-4">
        <button
          className="text-lg font-semibold text-blue-700 hover:underline"
          onClick={() => navigate('/intensives')}
        >
          ← Вернуться к списку интенсивов
        </button>
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
          <div
            key={test.id}
            className="flex flex-col gap-2 p-6 mb-6 bg-white border-2 border-blue-200 shadow-lg rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold text-blue-900">{test.name}</div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/tests/${test.id}`)}
                  className="px-4 py-1.5 rounded-lg bg-blue-100 text-blue font-semibold hover:bg-blue-200 transition"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => setDeletingTest(test)}
                  className="px-4 py-1.5 rounded-lg bg-red-100 text-red font-semibold hover:bg-red-200 transition"
                >
                  Удалить
                </button>
              </div>
            </div>
            {test.description && (
              <div className="mt-1 ml-1 text-base text-gray-700">{test.description}</div>
            )}
          </div>
        ))}
      {deletingTest && (
        <ConfirmDeleteModal
          onConfirm={handleDelete}
          onCancel={() => setDeletingTest(null)}
          title="Удалить тест?"
          description="Вы точно хотите удалить этот тест?"
        />
      )}
    </div>
  );
};

export default TestsPage;
