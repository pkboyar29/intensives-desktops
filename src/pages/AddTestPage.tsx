import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import InputDescription from '../components/common/inputs/InputDescription';
import Title from '../components/common/Title';
import PrimaryButton from '../components/common/PrimaryButton';

interface QuestionItem {
  name: string;
  description: string;
}

interface AddTestField {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

const AddTestPage: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddTestField>({
    mode: 'onBlur',
  });

  const [questions, setQuestions] = useState<QuestionItem[]>([]);

  const addQuestion = () => {
    // TODO: динамически номер вопроса изменять

    setQuestions((questions) => [
      ...questions,
      { name: 'Вопрос ', description: '' },
    ]);
  };

  const onSubmit = (data: AddTestField) => {
    console.log(data);
    console.log('submit submit');
  };

  return (
    <div className="flex justify-center max-w-[1280px] mt-5">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-[765px] w-full">
        <Title text="Добавить тест" />

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
            description="Название интенсива"
            placeholder="Название интенсива"
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
            description="Описание интенсива"
            placeholder="Описание интенсива"
            errorMessage={
              typeof errors.description?.message === 'string'
                ? errors.description.message
                : ''
            }
          />

          <div className="flex items-center gap-5">
            <div className="text-lg font-bold">Добавить вопрос</div>
            <div>
              <PrimaryButton
                buttonColor="gray"
                type="button"
                children="+"
                clickHandler={addQuestion}
              />
            </div>
          </div>

          {questions.length > 0 && (
            <div className="flex flex-col gap-4">
              {questions.map((question, index) => (
                <div
                  className="flex items-center justify-between gap-6"
                  key={index}
                >
                  {index + 1}
                  <InputDescription
                    fieldName="zxc"
                    register={register}
                    registerOptions={{
                      required: 'Поле обязательно',
                    }}
                    type="text"
                    description="Название вопроса"
                    placeholder="Название вопроса"
                    errorMessage={
                      typeof errors.startDate?.message === 'string'
                        ? errors.startDate.message
                        : ''
                    }
                  />

                  <InputDescription
                    fieldName="zxc1"
                    register={register}
                    registerOptions={{
                      required: 'Поле обязательно',
                    }}
                    type="text"
                    description="Описание вопроса"
                    placeholder="Описание вопроса"
                    errorMessage={
                      typeof errors.endDate?.message === 'string'
                        ? errors.endDate.message
                        : ''
                    }
                  />

                  <select
                    className="border border-black border-solid"
                    name=""
                    id=""
                  >
                    <option>Выбрать тип ответа</option>
                    <option>
                      Вопрос с выбором одного ответа (радиокнопка)
                    </option>
                    <option>
                      Вопрос с выбором нескольких ответов (чекбокс)
                    </option>
                  </select>

                  <div>Варианты ответа:</div>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3 my-3">
            <div className="text-lg font-bold">Сроки выполнения</div>

            <div className="flex justify-between gap-6">
              <InputDescription
                fieldName="openDate"
                register={register}
                registerOptions={{
                  required: 'Поле обязательно',
                }}
                type="date"
                description="Дата начала"
                placeholder="Дата начала"
                errorMessage={
                  typeof errors.startDate?.message === 'string'
                    ? errors.startDate.message
                    : ''
                }
              />

              <InputDescription
                fieldName="closeDate"
                register={register}
                registerOptions={{
                  required: 'Поле обязательно',
                  validate: {
                    lessThanOpenDt: (value: string, formValues) =>
                      new Date(value) > new Date(formValues.openDate) ||
                      'Дата завершения должна быть позже даты начала',
                  },
                }}
                type="date"
                description="Дата завершения"
                placeholder="Дата завершения"
                errorMessage={
                  typeof errors.endDate?.message === 'string'
                    ? errors.endDate.message
                    : ''
                }
              />
            </div>
          </div>

          <div className="flex my-5 gap-7">
            <PrimaryButton
              buttonColor="gray"
              type="button"
              children="Отмена"
              clickHandler={() => {
                console.log('отмена');
              }}
            />

            <PrimaryButton type="submit" children="Добавить" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddTestPage;
