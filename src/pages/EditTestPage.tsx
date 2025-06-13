import { FC, useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useGetQuestionsQuery } from '../redux/api/questionApi';
import { useUpdateTestMutation, useGetTestsQuery } from '../redux/api/testApi';
import PrimaryButton from '../components/common/PrimaryButton';
import Title from '../components/common/Title';
import InputDescription from '../components/common/inputs/InputDescription';
import MultipleSelectInput from '../components/common/inputs/MultipleSelectInput';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ITest } from '../ts/interfaces/ITest';
import Modal from '../components/common/modals/Modal';

const EditTestPage: FC = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { data: allTests } = useGetTestsQuery();
  const { data: questions } = useGetQuestionsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [updateTest] = useUpdateTestMutation();

  // Найти тест по id
  const test: ITest | undefined = allTests?.find((t) => t.id === Number(testId));

  // Локальные состояния
  const [selectedQuestions, setSelectedQuestions] = useState<{ id: number; name: string; order: number }[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [categoriesTouched, setCategoriesTouched] = useState(false);
  const [questionsTouched, setQuestionsTouched] = useState(false);
  const [showAllErrors, setShowAllErrors] = useState(false);
  const [questionsCategoryError, setQuestionsCategoryError] = useState('');
  const [questionCategories, setQuestionCategories] = useState<Record<number, string>>({});
  const [cancelModal, setCancelModal] = useState(false);

  // useForm
  const { register, handleSubmit, formState: { errors }, trigger, setValue } = useForm({ mode: 'onBlur' });

  // Инициализация данных теста
  useEffect(() => {
    if (test) {
      setValue('name', test.name);
      setValue('description', test.description || '');
      // Категории
      if ((test as any).categories) {
        setCategories((test as any).categories.map((c: any) => c.name));
      }
      // Вопросы
      if ((test as any).test_questions) {
        setSelectedQuestions(
          (test as any).test_questions.map((q: any, idx: number) => ({
            id: q.question,
            name: questions?.find((qq) => qq.id === q.question)?.title || '',
            order: q.order || idx + 1,
          }))
        );
        // Категории вопросов: сопоставляем id категории с её названием
        const categoryIdToName: Record<number, string> = {};
        if ((test as any).categories) {
          (test as any).categories.forEach((cat: any) => {
            categoryIdToName[cat.id] = cat.name;
          });
        }
        const qCats: Record<number, string> = {};
        (test as any).test_questions.forEach((q: any) => {
          if (q.category)
            qCats[q.question] = categoryIdToName[q.category] || '';
        });
        setQuestionCategories(qCats);
      }
    }
  }, [test, questions, setValue]);

  // Добавление категории
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
    // Сбросить категорию у всех вопросов, у которых была эта категория
    setQuestionCategories((prev) => {
      const updated: Record<number, string> = { ...prev };
      Object.keys(updated).forEach((qid) => {
        if (updated[Number(qid)] === cat) {
          updated[Number(qid)] = '';
        }
      });
      return updated;
    });
  };

  // Drag&Drop
  const ItemType = 'QUESTION';
  function moveQuestion(dragIndex: number, hoverIndex: number) {
    const updated = [...selectedQuestions];
    const [removed] = updated.splice(dragIndex, 1);
    updated.splice(hoverIndex, 0, removed);
    setSelectedQuestions(updated.map((q, idx) => ({ ...q, order: idx + 1 })));
  }
  const DraggableQuestion = ({ id, order, index, moveQuestion, children }: any) => {
    const ref = useRef<HTMLDivElement>(null);
    const [, drop] = useDrop({ accept: ItemType, hover(item: { index: number }, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveQuestion(dragIndex, hoverIndex);
      item.index = hoverIndex;
    }, });
    const [{ isDragging }, drag] = useDrag({ type: ItemType, item: { id, index }, collect: (monitor) => ({ isDragging: monitor.isDragging() }), });
    drag(drop(ref));
    return (
      <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, marginBottom: 16, boxShadow: '0 1px 4px #0001', padding: 16, }}>
        <span className="mr-2 text-gray-400">#{order}</span>
        {children}
      </div>
    );
  };

  // Сабмит
  const onSubmit = async (data: any) => {
    setShowAllErrors(true);
    let hasError = false;
    setQuestionsCategoryError('');
    if (categories.length === 0) {
      setCategoriesTouched(true);
      hasError = true;
    }
    if (selectedQuestions.length === 0) {
      setQuestionsTouched(true);
      hasError = true;
    }
    if (selectedQuestions.some(q => !questionCategories[q.id])) {
      setQuestionsCategoryError('Для каждого вопроса выберите категорию');
      hasError = true;
    }
    const valid = await trigger();
    if (!valid) hasError = true;
    if (hasError) return;
    try {
      await updateTest({ id: Number(testId), data: {
        name: data.name,
        description: data.description,
        author: test?.author ?? 0,
        categories: categories.map((name) => ({ name })),
        questions: selectedQuestions.map((q) => ({
          question: q.id,
          order: q.order,
          category: questionCategories[q.id] || null,
        })),
      }}).unwrap();
      navigate('/tests');
    } catch (e) {
      alert('Ошибка при редактировании теста');
    }
  };

  return (
    <div className="mt-[88px] min-h-screen overflow-y-auto max-w-[765px] mx-auto px-4">
      <Title text="Редактировать тест" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-3 mt-6 mb-3">
          <InputDescription
            fieldName="name"
            register={register}
            registerOptions={{ required: 'Поле обязательно к заполнению', minLength: { value: 4, message: 'Минимальное количество символов - 4', }, maxLength: { value: 50, message: 'Максимальное количество символов - 50', }, }}
            description="Название теста"
            placeholder="Название теста"
            errorMessage={typeof errors.name?.message === 'string' ? errors.name.message : ''}
          />
          <InputDescription
            isTextArea={true}
            fieldName="description"
            register={register}
            registerOptions={{ maxLength: { value: 500, message: 'Максимальное количество символов - 500', }, }}
            description="Описание теста"
            placeholder="Описание теста"
            errorMessage={typeof errors.description?.message === 'string' ? errors.description.message : ''}
          />
        </div>
        {/* Категории теста */}
        <div className="flex flex-col mb-4 text-lg">
          <label className="block mb-1">Категории теста</label>
          <div className="flex gap-2 mb-2">
            <input type="text" value={categoryInput} onChange={(e) => { setCategoryInput(e.target.value); setCategoryError(''); }} className="px-2 py-1 border rounded" placeholder="Название категории" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCategory(); } }} />
            <button type="button" onClick={addCategory} className="px-2 py-1 text-black bg-blue-500 rounded">Добавить</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span key={cat} className="flex items-center px-2 py-1 bg-gray-200 rounded">
                {cat}
                <button type="button" onClick={() => removeCategory(cat)} className="ml-1 text-red-500">×</button>
              </span>
            ))}
          </div>
          {(categoryError || (showAllErrors && categories.length === 0)) && (
            <div className="mt-1 text-sm" style={{ color: '#ef4444' }}>{categoryError || 'Добавьте хотя бы одну категорию'}</div>
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
                setSelectedQuestions((prev) => {
                  const withOrder = items.map((item, idx) => {
                    const found = prev.find((q) => q.id === item.id);
                    return found ? found : { ...item, order: idx + 1 };
                  });
                  return withOrder.map((q, idx) => ({ ...q, order: idx + 1 }));
                });
              }}
            />
            {(showAllErrors && selectedQuestions.length === 0) && (
              <div className="mt-1 text-sm" style={{ color: '#ef4444' }}>
                Выберите хотя бы один вопрос
              </div>
            )}
            {questionsCategoryError && (
              <div className="mt-1 text-sm" style={{ color: '#ef4444' }}>{questionsCategoryError}</div>
            )}
            {selectedQuestions.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-2 font-semibold">Добавленные вопросы (перетащите для изменения порядка):</h3>
                <DndProvider backend={HTML5Backend}>
                  {selectedQuestions.sort((a, b) => a.order - b.order).map((sel, idx) => {
                    const fullQuestion = questions?.find((q) => q.id === sel.id);
                    return (
                      <DraggableQuestion key={sel.id} id={sel.id} order={sel.order} index={idx} moveQuestion={moveQuestion}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            {fullQuestion ? (
                              <>
                                <div className="mb-1 text-lg font-semibold">{fullQuestion.title}</div>
                                {fullQuestion.description && <div className="mb-2 text-gray-600">{fullQuestion.description}</div>}
                                {fullQuestion.answerOptions && fullQuestion.answerOptions.length > 0 && (
                                  <ul className="pl-5 list-disc">
                                    {fullQuestion.answerOptions.map((opt) => (
                                      <li key={opt.id} className="flex items-center mb-1 list-none">
                                        <span className="mr-2 text-lg">{fullQuestion.questionType === 'Один вариант ответа' ? '◯' : '☐'}</span>
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
                            <select className="px-2 py-1 border rounded" value={questionCategories[sel.id] || ''} onChange={e => { setQuestionCategories(prev => ({ ...prev, [sel.id]: e.target.value })); }}>
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
          <PrimaryButton type="submit" children="Редактировать тест" clickHandler={handleSubmit(onSubmit)} />
        </div>
      </form>
      {cancelModal && (
        <Modal
          title="Вы уверены, что хотите прекратить редактирование теста?"
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
                children="Продолжить редактирование"
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

export default EditTestPage;
