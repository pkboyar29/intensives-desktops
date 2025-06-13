import MultipleSelectInput from '../components/common/inputs/MultipleSelectInput';
import { useState, FC, useEffect, useRef } from 'react';
import PrimaryButton from '../components/common/PrimaryButton';
import Title from '../components/common/Title';
import InputDescription from '../components/common/inputs/InputDescription';
import { useForm } from 'react-hook-form';
import { useGetQuestionsQuery } from '../redux/api/questionApi';
import { useCreateTestMutation } from '../redux/api/testApi';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/common/modals/Modal';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const CreateTestPage: FC = () => {
  const { data: questions } = useGetQuestionsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  // Исправляем тип selectedQuestions, чтобы был order
  const [selectedQuestions, setSelectedQuestions] = useState<
    { id: number; name: string; order: number }[]
  >([]);
  const [questionsTouched, setQuestionsTouched] = useState(false); // для onBlur
  const [createTest, { isLoading: isCreating }] = useCreateTestMutation();
  const [cancelModal, setCancelModal] = useState(false);
  const navigate = useNavigate();

  // Категории теста
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState('');
  const [categoriesTouched, setCategoriesTouched] = useState(false);
  const [categoryError, setCategoryError] = useState(''); // ошибка для поля ввода категории

  const addCategory = () => {
    const trimmed = categoryInput.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      setCategoryError('Категории не должны повторяться');
      setCategoriesTouched(true);
      return;
    }
    setCategories([...categories, trimmed]);
    setCategoryInput('');
    setCategoryError('');
    setCategoriesTouched(true);
  };
  const removeCategory = (cat: string) => {
    setCategories(categories.filter((c) => c !== cat));
    setCategoryError('');
  };

  interface TestFields {
    name: string;
    description: string;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
    trigger,
    getValues,
  } = useForm<TestFields>({
    mode: 'onBlur',
  });

  const [formSubmitted, setFormSubmitted] = useState(false); // Был ли сабмит
  const [showAllErrors, setShowAllErrors] = useState(false); // как в модалке: показывать все ошибки после первой попытки

  // Глобальная ошибка выбора вопросов
  const questionsError =
    (showAllErrors || questionsTouched) && selectedQuestions.length === 0
      ? 'Выберите хотя бы один вопрос'
      : '';

  // Глобальная ошибка по категориям
  const categoriesError =
    (showAllErrors || categoriesTouched) && categories.length === 0
      ? 'Добавьте хотя бы одну категорию'
      : '';

  // Для хранения ошибки по категориям вопросов
  const [questionsCategoryError, setQuestionsCategoryError] = useState('');

  // Считаем поле "троганым" при первом изменении выбора
  useEffect(() => {
    if (selectedQuestions.length > 0 && !questionsTouched) {
      setQuestionsTouched(true);
    }
  }, [selectedQuestions]);

  useEffect(() => {
    if (categories.length > 0 && !categoriesTouched) {
      setCategoriesTouched(true);
    }
  }, [categories]);

  // Для хранения выбранной категории для каждого вопроса
  const [questionCategories, setQuestionCategories] = useState<Record<number, string>>({});

  // submit через handleSubmit, как в QuestionModal
  const onSubmit = async (data: TestFields) => {
    setShowAllErrors(true); // После первой попытки всегда показывать все ошибки
    let hasError = false;
    setQuestionsCategoryError('');
    // Проверка категорий
    if (categories.length === 0) {
      setCategoriesTouched(true);
      hasError = true;
    }
    // Проверка вопросов
    if (selectedQuestions.length === 0) {
      setQuestionsTouched(true);
      hasError = true;
    }
    // Проверка: у каждого вопроса выбрана категория
    if (selectedQuestions.some(q => !questionCategories[q.id])) {
      setQuestionsCategoryError('Для каждого вопроса выберите категорию');
      hasError = true;
    }
    // Проверка названия теста (через react-hook-form)
    const valid = await trigger();
    if (!valid) hasError = true;
    if (hasError) return;

    const author = 1; // заменить на актуального пользователя
    try {
      await createTest({
        name: data.name,
        description: data.description,
        author,
        categories: categories.map((name) => ({ name })),
        questions: selectedQuestions.map((q) => ({
          question: q.id,
          order: q.order,
          category: questionCategories[q.id] || null,
        })),
      }).unwrap();
      navigate('/tests');
    } catch (e) {
      alert('Ошибка при создании теста');
    }
  };

  // --- Drag&Drop для вопросов ---
  const ItemType = 'QUESTION';

  function moveQuestion(dragIndex: number, hoverIndex: number) {
    const updated = [...selectedQuestions];
    const [removed] = updated.splice(dragIndex, 1);
    updated.splice(hoverIndex, 0, removed);
    setSelectedQuestions(updated.map((q, idx) => ({ ...q, order: idx + 1 })));
  }

  const DraggableQuestion = ({
    id,
    order,
    index,
    moveQuestion,
    children,
  }: any) => {
    const ref = useRef<HTMLDivElement>(null);
    const [, drop] = useDrop({
      accept: ItemType,
      hover(item: { index: number }, monitor) {
        if (!ref.current) return;
        const dragIndex = item.index;
        const hoverIndex = index;
        if (dragIndex === hoverIndex) return;
        moveQuestion(dragIndex, hoverIndex);
        item.index = hoverIndex;
      },
    });
    const [{ isDragging }, drag] = useDrag({
      type: ItemType,
      item: { id, index },
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    });
    drag(drop(ref));
    return (
      <div
        ref={ref}
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: 'move',
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          marginBottom: 16,
          boxShadow: '0 1px 4px #0001',
          padding: 16,
        }}
      >
        <span className="mr-2 text-gray-400">#{order}</span>
        {children}
      </div>
    );
  };

  return (
    <div className="mt-[88px] min-h-screen overflow-y-auto max-w-[765px] mx-auto px-4">
      <Title text="Создать тест" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-3 mt-6 mb-3">
          <InputDescription
            fieldName="name"
            register={register}
            registerOptions={{
              required: 'Поле обязательно к заполнению',
              minLength: {
                value: 4,
                message: 'Минимальное количество символов - 4',
              },
              maxLength: {
                value: 50,
                message: 'Максимальное количество символов - 50',
              },
            }}
            description="Название теста"
            placeholder="Название теста"
            errorMessage={
              typeof errors.name?.message === 'string'
                ? errors.name.message
                : ''
            }
          />

          <InputDescription
            isTextArea={true}
            fieldName="description"
            register={register}
            registerOptions={{
              maxLength: {
                value: 500,
                message: 'Максимальное количество символов - 500',
              },
            }}
            description="Описание теста"
            placeholder="Описание теста"
            errorMessage={
              typeof errors.description?.message === 'string'
                ? errors.description.message
                : ''
            }
          />
        </div>
        {/* Категории теста */}
        <div className="flex flex-col mb-4 text-lg">
          <label className="block mb-1">Категории теста</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={categoryInput}
              onChange={(e) => {
                setCategoryInput(e.target.value);
                setCategoryError('');
              }}
              className="px-2 py-1 border rounded"
              placeholder="Название категории"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCategory();
                }
              }}
            />
            <button
              type="button"
              onClick={addCategory}
              className="px-2 py-1 text-black bg-blue-500 rounded"
            >
              Добавить
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span
                key={cat}
                className="flex items-center px-2 py-1 bg-gray-200 rounded"
              >
                {cat}
                <button
                  type="button"
                  onClick={() => removeCategory(cat)}
                  className="ml-1 text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          {(categoryError || categoriesError) && (
            <div className="mt-1 text-sm" style={{ color: '#ef4444' }}>
              {categoryError || categoriesError}
            </div>
          )}
        </div>
        {/* Вопросы */}
        {questions && (
          <div className="mb-4">
            <MultipleSelectInput
              description="Выберите вопросы"
              items={questions.map((q) => ({ id: q.id, name: q.title }))}
              selectedItems={selectedQuestions}
              setSelectedItems={(items) => {
                // Сохраняем порядок, если вопрос уже был, иначе добавляем в конец
                setSelectedQuestions((prev) => {
                  // Сохраняем старый order для уже выбранных
                  const withOrder = items.map((item, idx) => {
                    const found = prev.find((q) => q.id === item.id);
                    return found ? found : { ...item, order: idx + 1 };
                  });
                  // Пересчитываем order для всех
                  return withOrder.map((q, idx) => ({ ...q, order: idx + 1 }));
                });
              }}
            />
            {questionsError && (
              <div className="mt-1 text-sm" style={{ color: '#ef4444' }}>
                {questionsError}
              </div>
            )}
            {questionsCategoryError && (
              <div className="mt-1 text-sm" style={{ color: '#ef4444' }}>
                {questionsCategoryError}
              </div>
            )}
            {selectedQuestions.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-2 font-semibold">
                  Добавленные вопросы (перетащите для изменения порядка):
                </h3>
                <DndProvider backend={HTML5Backend}>
                  {selectedQuestions
                    .sort((a, b) => a.order - b.order)
                    .map((sel, idx) => {
                      const fullQuestion = questions?.find((q) => q.id === sel.id);
                      return (
                        <DraggableQuestion
                          key={sel.id}
                          id={sel.id}
                          order={sel.order}
                          index={idx}
                          moveQuestion={moveQuestion}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              {fullQuestion ? (
                                <>
                                  <div className="mb-1 text-lg font-semibold">
                                    {fullQuestion.title}
                                  </div>
                                  {fullQuestion.description && (
                                    <div className="mb-2 text-gray-600">
                                      {fullQuestion.description}
                                    </div>
                                  )}
                                  {fullQuestion.answerOptions &&
                                    fullQuestion.answerOptions.length > 0 && (
                                      <ul className="pl-5 list-disc">
                                        {fullQuestion.answerOptions.map((opt) => (
                                          <li key={opt.id} className="flex items-center mb-1 list-none">
                                            <span className="mr-2 text-lg">
                                              {fullQuestion.questionType === 'Один вариант ответа' ? '◯' : '☐'}
                                            </span>
                                            <span>{opt.text}</span>
                                            <span className="ml-2">{opt.value}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                </>
                              ) : (
                                <div className="text-red-500">Вопрос не найден</div>
                              )}
                            </div>
                            {/* Select для выбора категории */}
                            <div>
                              <select
                                className="px-2 py-1 border rounded"
                                value={questionCategories[sel.id] || ''}
                                onChange={e => {
                                  setQuestionCategories(prev => ({ ...prev, [sel.id]: e.target.value }));
                                }}
                              >
                                <option value="">Без категории</option>
                                {categories.map(cat => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </DraggableQuestion>
                      );
                    })}
                </DndProvider>
              </div>
            )}
          </div>
        )}
        <div className="flex my-5 gap-7">
          <PrimaryButton
            buttonColor="gray"
            type="button"
            children="Отмена"
            clickHandler={() => setCancelModal(true)}
          />
          <PrimaryButton type="submit" children="Создать тест" clickHandler={handleSubmit(onSubmit)} />
        </div>
      </form>
      {cancelModal && (
        <Modal
          title="Вы уверены, что хотите прекратить создание теста?"
          onCloseModal={() => setCancelModal(false)}
          shouldHaveCrossIcon={true}
        >
          <p className="text-lg text-bright_gray">
            Все сделанные вами изменения не будут сохранены.
          </p>
          <div className="flex flex-col justify-end gap-3 mt-3 md:flex-row md:mt-6">
            <div>
              <PrimaryButton
                buttonColor="gray"
                clickHandler={() => setCancelModal(false)}
                children="Продолжить создание"
              />
            </div>
            <div>
              <PrimaryButton
                clickHandler={() => {
                  setCancelModal(false);
                  navigate('/tests');
                }}
                children="Отменить"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CreateTestPage;
