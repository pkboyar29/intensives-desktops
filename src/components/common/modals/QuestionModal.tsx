import React, { FC, useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form'; // useFieldArray — хук для работы с массивами полей (варианты ответов)
import Modal from '../modals/Modal';
import InputDescription from '../inputs/InputDescription'; //
import PrimaryButton from '../PrimaryButton';
import Select from '../inputs/Select';
import {
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
} from '../../../redux/api/questionApi';
import { IAnswerOption, IQuestion, IQuestionCreate } from '../../../ts/interfaces/IQuestion';


interface QuestionModalProps {
  onClose: () => void;
  question?: IQuestion | null; // объект вопроса (если редактируем)
}

// Структура данных формы (то, что собирается и отправляется на сервер)
interface QuestionFields {
  title: string;
  description: string;
  questionType: number;
  answerOptions: IAnswerOption[];
}

// QuestionModal — модальное окно для создания/редактирования вопроса. Открывается при modalOpen
const QuestionModal: FC<QuestionModalProps> = ({ onClose, question }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setError,
    clearErrors,
    watch, // Добавляем вызов watch для отслеживания изменений в answerOptions
  } = useForm<QuestionFields>({
    mode: 'onBlur',
    defaultValues: question
      ? {
          ...question,
          questionType: question.questionType == 'Один вариант ответа' ? 1 : 2,
          answerOptions: question.answerOptions
            ? question.answerOptions.map((opt) => ({
                id: opt.id,
                text: opt.text,
                value: opt.value,
              }))
            : [],
        }
      : { answerOptions: [{ text: '', value: 1 }] },
  });

  // Следим за изменениями вариантов ответа
  const answerOptions = watch('answerOptions');

  // Состояние для глобальной ошибки дубликата и отсутствия правильного ответа
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [noCorrectError, setNoCorrectError] = useState<string | null>(null);

  // Автоматическая валидация на дублирующиеся ответы и наличие хотя бы одного value === 1
  useEffect(() => {
    if (!answerOptions) return; // Если нет вариантов ответа, выходим
    const texts = answerOptions.map((opt: IAnswerOption) => opt.text.trim()); // Получаем массив текстов ответов (обрезаем пробелы по краям)
    const hasDuplicates = texts.some(
      (text: string, idx: number) => text && texts.indexOf(text) !== idx
    ); // text && — исключаем пустые строки; texts.indexOf(text) !== idx — если текущий индекс не совпадает с первым вхождением, значит это дубликат
    // Если есть дубликаты и хотя бы два непустых одинаковых ответа (исключает ложные срабатывания, если все ответы пустые)
    if (hasDuplicates && texts.filter(Boolean).length > 1) {
      setDuplicateError('Ответы не должны повторяться');
    } else {
      setDuplicateError(null);
    }
    // Проверка на хотя бы один value === 1
    const hasCorrect = answerOptions.some((opt: IAnswerOption) => Number(opt.value) >= 1);
    if (!hasCorrect) {
      setNoCorrectError('Должен быть хотя бы один вариант с оценкой не меньше 1');
    } else {
      setNoCorrectError(null);
    }
  }, [JSON.stringify(answerOptions)]); /* Эффект запускается каждый раз, когда массив answerOptions изменяется (Принудительно триггерим useEffect, когда массив меняется)
  Используется JSON.stringify, чтобы отследить любые изменения значений внутри массива (не только ссылку на объект, как обычно в React) */

  // Если question меняется, сбрасываем форму (необходимо сбросить текущие значения формы и заменить на новые)
  React.useEffect(() => {
    if (question) {
      reset({
        ...question,
        questionType: question.questionType == 'Один вариант ответа' ? 1 : 2, // Конвертация questionType в число
      });
    }
  }, [question, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'answerOptions',
  });

  // RTK Query-хуки для отправки запросов на создание и редактирование вопросов
  const [createQuestion, { isLoading }] = useCreateQuestionMutation();
  const [updateQuestion] = useUpdateQuestionMutation();

  const isEdit = !!question && !!question.id; // Проверяем, редактируем ли мы существующий вопрос или создаем новый (двойная инверсия: приводит к булевому типу)
  // Если редактируем, то заголовок будет "Редактирование вопроса", иначе "Создание вопроса"

  const onSubmit = (data: QuestionFields) => {
    if (duplicateError || noCorrectError) return;
    // Дополнительная проверка на дубликаты (на всякий случай)
    const texts = data.answerOptions.map((opt) => opt.text.trim());
    const hasDuplicates = texts.some(
      (text, idx) => text && texts.indexOf(text) !== idx
    );
    if (hasDuplicates) return;

    const payload: IQuestionCreate = {
      ...data,
      questionType: data.questionType == 1 ? 'single' : 'multiple',
      answerOptions: data.answerOptions.map((option) => ({
        id: option.id, // важно для редактирования
        text: option.text,
        value: option.value,
      })),
    };
    if (isEdit) {
      updateQuestion({ id: (question as any).id, data: payload }).then(onClose);
    } else {
      createQuestion(payload).then(onClose);
    }
  };

  return (
    <Modal
      title={isEdit ? 'Редактирование вопроса' : 'Создание вопроса'}
      onCloseModal={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputDescription
          register={register}
          fieldName="title"
          registerOptions={{
            required: 'Поле обязательно к заполнению',
            maxLength: {
              value: 255,
              message: 'Максимальное количество символов - 255',
            },
          }}
          placeholder="Название вопроса"
          errorMessage={
            typeof errors.title?.message === 'string'
              ? errors.title.message
              : ''
          }
        />

        <div className="mt-4">
          <InputDescription
            isTextArea={true}
            register={register}
            registerOptions={{
              maxLength: {
                value: 1000,
                message: 'Максимальное количество символов - 1000',
              },
            }}
            fieldName="description"
            placeholder="Описание вопроса"
            errorMessage={
              typeof errors.description?.message === 'string'
                ? errors.description.message
                : ''
            }
          />
        </div>

        <div className="mt-4">
          <Select
            register={register}
            fieldName="questionType"
            initialText="Выберите тип вопроса"
            options={[
              { id: 1, name: 'Один вариант ответа' },
              { id: 2, name: 'Несколько вариантов ответа' },
            ]}
            registerOptions={{
              required: 'Поле обязательно для заполнения',
              validate: (value) => {
                if (value == 0) {
                  return 'Выберите тип вопроса';
                }
                return true;
              },
            }}
            errorMessage={
              typeof errors.questionType?.message === 'string'
                ? errors.questionType.message
                : ''
            }
          />
        </div>

        <div className="mt-4">
          <h3 className="mb-2 text-lg font-medium">Варианты ответов</h3>
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-4 mb-2">
              <InputDescription
                register={register}
                fieldName={`answerOptions.${index}.text`}
                registerOptions={{
                  required: 'Текст ответа обязателен',
                }}
                placeholder="Текст ответа"
                errorMessage={
                  typeof errors.answerOptions?.[index]?.text?.message ===
                  'string'
                    ? errors.answerOptions[index].text.message
                    : ''
                }
              />
              <InputDescription
                register={register}
                fieldName={`answerOptions.${index}.value`}
                registerOptions={{
                  required: 'Оценка обязательна',
                  min: {
                    value: 0,
                    message: 'Оценка не может быть отрицательной',
                  },
                }}
                placeholder="Оценка"
                type="number"
                errorMessage={
                  typeof errors.answerOptions?.[index]?.value?.message ===
                  'string'
                    ? errors.answerOptions[index].value.message
                    : ''
                }
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="px-3 py-2 text-red-500 border border-red-500 rounded hover:text-red-700 hover:border-red-700"
                >
                  Удалить
                </button>
              )}
            </div>
          ))}
          {/* Глобальные ошибки */}
          {duplicateError && (
            <div className="mb-2 text-sm" style={{ color: '#ef4444' }}>
              {duplicateError}
            </div>
          )}
          {noCorrectError && (
            <div className="mb-2 text-sm" style={{ color: '#ef4444' }}>
              {noCorrectError}
            </div>
          )}
          <button
            type="button"
            onClick={() => append({ text: '', value: 0 })}
            className="text-blue-500 hover:text-blue-700"
          >
            Добавить вариант ответа
          </button>
        </div>
        <div className="mt-4">
          <PrimaryButton
            type="submit"
            clickHandler={handleSubmit(onSubmit)}
            children={isEdit ? 'Редактировать вопрос' : 'Создать вопрос'}
            disabled={!!duplicateError || !!noCorrectError}
          />
        </div>
      </form>
    </Modal>
  );
};

export default QuestionModal;