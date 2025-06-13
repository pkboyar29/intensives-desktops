import Title from "../components/common/Title"
import PrimaryButton from "../components/common/PrimaryButton";
import { FC, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AttachTestModal from '../components/common/modals/AttachTestModal';
import ConfirmDeleteModal from '../components/common/modals/ConfirmDeleteModal';
import EditAttachTestModal from '../components/common/modals/EditAttachTestModal';
import {
  useAttachTestMutation,
  useDetachTestMutation,
  useLazyGetIntensiveTestQuery,
  useEditTestMutation,
} from '../redux/api/testIntensiveApi';

const IntensiveTests = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { intensiveId } = useParams();
  const [attachTest] = useAttachTestMutation();
  const [detachTest] = useDetachTestMutation();
  const [editTest] = useEditTestMutation();
  const [getTests, { data: tests, isLoading }] = useLazyGetIntensiveTestQuery(
    
  );
  
useEffect(() => {getTests(intensiveId)}, [intensiveId, getTests]);

  const handleAttach = async (data: { testId: number; startDate: string; endDate: string; attempts: number }) => {
    if (!intensiveId) return;
    try {
      await attachTest({
        intensiveId,
        testId: data.testId,
        startDate: data.startDate,
        endDate: data.endDate,
        attempts: data.attempts,
      }).unwrap();
      getTests(intensiveId); // Принудительно обновляем список тестов после успешного добавления
    } catch (e) {
      // Можно добавить обработку ошибок
    }
  };

  const [editModal, setEditModal] = useState<{ open: boolean; test: any } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; test: any } | null>(null);

  const handleEdit = async (testObj: any, values: { startDate: string; endDate: string; attempts: number }) => {
    if (!intensiveId) return;
    await editTest({
      pk: testObj.id,
      startDate: values.startDate,
      endDate: values.endDate,
      attempts: values.attempts,
    });
    getTests(intensiveId);
    setEditModal(null);
  };

  const handleDelete = async (testObj: any) => {
    await detachTest({ pk: testObj.id });
    getTests(intensiveId);
    setDeleteModal(null);
  };

  return (
    <div>
      <Title text="Тесты" />
      {/*
      <div className="flex justify-end">
        <div>
          <PrimaryButton clickHandler={() => setModalOpen(true)}>
            Прикрепить тест
          </PrimaryButton>
        </div>
      </div>
      <AttachTestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAttach={handleAttach}
      />
      {editModal && (
        <EditAttachTestModal
          isOpen={editModal.open}
          onClose={() => setEditModal(null)}
          onEdit={values => handleEdit(editModal.test, values)}
          initial={editModal.test}
        />
      )}
      {deleteModal && (
        <ConfirmDeleteModal
          title="Удалить привязку теста?"
          description={`Вы точно хотите удалить привязку теста "${deleteModal.test.test?.name || deleteModal.test.name}" к интенсиву?`}
          onConfirm={() => handleDelete(deleteModal.test)}
          onCancel={() => setDeleteModal(null)}
        />
      )}
      */}
      <div className="mt-6">
        {isLoading && <div>Загрузка...</div>}
        {tests && tests.results && tests.results.length === 0 && (
          <div>Нет прикрепленных тестов</div>
        )}
        {tests && tests.results && tests.results.length > 0 && (
          <ul className="space-y-6">
            {tests.results.map((test: any) => (
              <li
                key={test.id}
                className="flex flex-col gap-3 p-6 mb-4 transition bg-white border-2 border-blue-200 shadow-sm rounded-xl hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-blue-900">
                    {test.test?.name || test.name}
                  </div>
                  {/*
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditModal({ open: true, test })}
                      className="px-4 py-1.5 rounded-lg bg-blue-100 text-blue font-semibold hover:bg-blue-200 transition"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => setDeleteModal({ open: true, test })}
                      className="px-4 py-1.5 rounded-lg bg-red-100 text-red font-semibold hover:bg-red-200 transition"
                    >
                      Удалить
                    </button>
                  </div>
                  */}
                  <div>
                    <PrimaryButton
                    clickHandler={() => {
                      // Здесь можно реализовать переход на страницу прохождения теста
                      // Например: navigate(`/intensive/${intensiveId}/test/${test.test?.id || test.id}/pass`);
                    }}
                  >
                    Пройти тест
                  </PrimaryButton>
                  </div>
                </div>
                {test.test?.description || test.description ? (
                  <div className="mt-1 ml-1 text-lg text-gray-700">
                    {test.test?.description || test.description}
                  </div>
                ) : null}
                <div className="flex flex-wrap gap-6 mt-2 ml-1 text-base text-gray-500">
                  {test.start_date && (
                    <div>
                      <span className="font-semibold text-gray-700">Доступен с:</span> {new Date(test.start_date).toLocaleString()}
                    </div>
                  )}
                  {test.end_date && (
                    <div>
                      <span className="font-semibold text-gray-700">Доступен до:</span> {new Date(test.end_date).toLocaleString()}
                    </div>
                  )}
                  {test.attempts_allowed && (
                    <div>
                      <span className="font-semibold text-gray-700">Попыток:</span> {test.attempts_allowed}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default IntensiveTests;