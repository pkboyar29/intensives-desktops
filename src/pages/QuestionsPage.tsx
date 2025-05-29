import { useState } from 'react';
import {
  useGetQuestionsQuery,
  useDeleteQuestionMutation,
} from '../redux/api/questionApi'; // хуки RTK Query для получения списка вопросов и удаления вопроса через API.
import QuestionModal from '../components/common/modals/QuestionModal';
import ConfirmDeleteModal from '../components/common/modals/ConfirmDeleteModal';
import PrimaryButton from '../components/common/PrimaryButton';
import Title from '../components/common/Title'; // компонент для отображения заголовка страницы

// функциональный компонент React, который отображает страницу с вопросами
const QuestionsPage = () => {
  // состояния компонента
  const { data: questions, isLoading, error, refetch } = useGetQuestionsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  }); // нужно для автоматического обновления данных при переходах между страницами
  const [modalOpen, setModalOpen] = useState(false); // modalOpen — открыто ли модальное окно для создания/редактирования
  const [editingQuestion, setEditingQuestion] = useState<any | null>(null); // editingQuestion — вопрос, который сейчас редактируется (или null, если создаём новый)
  const [deletingQuestion, setDeletingQuestion] = useState<any | null>(null); // deletingQuestion — вопрос, который пользователь хочет удалить (или null)
  const [deleteQuestion] = useDeleteQuestionMutation(); // deleteQuestion — функция для удаления вопроса через API

  // обработчик события редактирования вопроса
  // принимает вопрос в качестве аргумента и открывает модальное окно для редактирования
  // В handleEdit мы просто открываем модальное окно и устанавливаем состояние — это синхронные операции, не требующие ожидания
  const handleEdit = (question: any) => {
    setEditingQuestion(question); // сохраняем выбранный вопрос
    setModalOpen(true);
  };

  // handleDelete — удаляет выбранный вопрос через API, закрывает модалку и обновляет список вопросов
  // вызывается при подтверждении удаления в модальном окне
  // В handleDelete мы ждём завершения операции удаления, прежде чем закрыть модальное окно и обновить список вопросов
  // Если deletingQuestion не установлен, то ничего не делаем
  const handleDelete = async () => {
    if (deletingQuestion) {
      await deleteQuestion(deletingQuestion.id);
      setDeletingQuestion(null);
      refetch();
    }
  };

  return (
    <div className="mt-[88px] min-h-screen overflow-y-auto max-w-[1280px] mx-auto px-4">
      <Title text="Банк вопросов" />
      <div className="flex justify-end">
        <div>
          <PrimaryButton
            children="Создать вопрос"
            clickHandler={() => {
              setEditingQuestion(null); // сбрасывает состояние редактируемого вопроса (модальное окно откроется в режиме создания нового вопроса, а не редактирования существующего)
              setModalOpen(true);
            }}
          />
        </div>
      </div>
      {isLoading && <div>Загрузка...</div>}
      {error && <div>Ошибка загрузки</div>}
      {questions && questions.length === 0 && <div>Нет вопросов</div>}
      {questions &&
        questions.map((question) => (
          <div key={question.id} className="p-4 mb-6 bg-white rounded shadow">
            <p className="font-semibold">{question.title}</p>
            <p className="mt-2 ml-4">{question.description}</p>
            <div className="mt-2 ml-4">
              {question.answerOptions?.map((answer) => (
                <div key={answer.id} className="flex items-center mb-1">
                  <span className="mr-2 text-lg">
                    {question.questionType === 'Один вариант ответа'
                      ? '◯'
                      : '☐'}
                  </span>
                  <span>{answer.text}</span>
                  <span className="ml-2">{answer.value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEdit(question)}
                className="px-3 py-1 transition bg-blue-100 rounded text-blue hover:bg-blue-200"
              >
                Редактировать
              </button>
              <button
                onClick={() => setDeletingQuestion(question)}
                className="px-3 py-1 transition bg-red-100 rounded text-red hover:bg-red-200"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      {modalOpen && (
        <QuestionModal
          question={editingQuestion} // передаём вопрос для редактирования или null для создания нового
          onClose={() => {
            setModalOpen(false);
            setEditingQuestion(null);
            refetch(); // обновляем список вопросов после закрытия модалки
          }}
        />
      )}
      {deletingQuestion && (
        <ConfirmDeleteModal
          onConfirm={handleDelete} // вызываем handleDelete при подтверждении удаления
          onCancel={() => setDeletingQuestion(null)}
        />
      )}
    </div>
  );
};

export default QuestionsPage;
