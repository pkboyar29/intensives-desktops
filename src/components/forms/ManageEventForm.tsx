import { FC, useEffect, useState } from 'react';
import { useForm, Controller, UseFormRegister } from 'react-hook-form';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  getISODateInUTC3,
  getTimeFromDate,
  transformSeparateDateAndTimeToISO,
} from '../../helpers/dateHelpers';
import { FetchBaseQueryError, skipToken } from '@reduxjs/toolkit/query';

import { useGetTeamsQuery } from '../../redux/api/teamApi';
import { useGetAudiencesQuery } from '../../redux/api/audienceApi';
import { useGetStagesForIntensiveQuery } from '../../redux/api/stageApi';
import { useGetMarkStrategiesQuery } from '../../redux/api/markStrategyApi';
import { useGetCriteriasQuery } from '../../redux/api/criteriaApi';
import {
  useGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
} from '../../redux/api/eventApi';

import { useAppSelector } from '../../redux/store';

import Select from '../common/inputs/Select';
import InputDescription from '../common/inputs/InputDescription';
import MultipleSelectInput from '../common/inputs/MultipleSelectInput';
import Title from '../common/Title';
import PrimaryButton from '../common/PrimaryButton';
import Modal from '../common/modals/Modal';
import FileUpload from '../common/inputs/FileInput';
import InputRadio from '../common/inputs/InputRadio';
import { ToastContainer, toast } from 'react-toastify';

import { IMarkStrategy } from '../../ts/interfaces/IMarkStrategy';

interface ManageEventFormFields {
  name: string;
  description: string;
  startDate: string;
  finishDate: string;
  startTime: string;
  finishTime: string;
  audience: number;
  stage: number;
  scoreType: 'withoutMarkStrategy' | 'withMarkStrategy' | 'withCriterias';
  markStrategy: string;
  criterias: Item[];
  teams: Item[];
  teachers: Item[];
}

interface Item {
  id: number;
  name: string;
}

const renderMarkStrategies = (
  markStrategies: IMarkStrategy[] | undefined,
  register: UseFormRegister<ManageEventFormFields>,
  currentValue: string
) =>
  markStrategies?.map((markStrategy) => (
    <InputRadio
      register={register}
      fieldName="markStrategy"
      key={markStrategy.id}
      value={markStrategy.id.toString()}
      currentValue={currentValue}
      description={markStrategy.name}
    />
  ));

const ManageEventForm: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { intensiveId } = useParams();

  const currentIntensive = useAppSelector((state) => state.intensive.data);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<ManageEventFormFields>({
    mode: 'onBlur',
  });
  const formValues = watch();

  const [createEvent] = useCreateEventMutation();
  const [updateEvent] = useUpdateEventMutation();

  const { data: event } = useGetEventQuery(
    Number(searchParams.get('eventId')) || skipToken,
    { refetchOnMountOrArgChange: true }
  );

  const { data: teamsToChoose } = useGetTeamsQuery(Number(intensiveId), {
    refetchOnMountOrArgChange: true,
  });
  const teachersToChoose = currentIntensive?.teachers;
  const { data: stagesToChoose } = useGetStagesForIntensiveQuery(
    Number(intensiveId),
    {
      refetchOnMountOrArgChange: true,
    }
  );
  // TODO: начать получать аудитории университета интенсива
  const { data: audiencesToChoose } = useGetAudiencesQuery();
  const { data: markStrategies } = useGetMarkStrategiesQuery();
  const { data: criterias } = useGetCriteriasQuery();

  const [cancelModal, setCancelModal] = useState<boolean>(false);
  const [successfulSaveModal, setSuccessfulSaveModal] = useState<{
    status: boolean;
    eventId: number | null;
  }>({
    status: false,
    eventId: null,
  });

  useEffect(() => {
    if (markStrategies) {
      if (event) {
        let scoreType:
          | 'withoutMarkStrategy'
          | 'withMarkStrategy'
          | 'withCriterias' = 'withoutMarkStrategy';

        if (event.markStrategy) {
          if (event.criterias.length > 0) {
            scoreType = 'withCriterias';
          } else {
            scoreType = 'withMarkStrategy';
          }
        }

        reset({
          name: event.name,
          description: event.description,
          startDate: getISODateInUTC3(event.startDate),
          finishDate: getISODateInUTC3(event.finishDate),
          startTime: getTimeFromDate(event.startDate),
          finishTime: getTimeFromDate(event.finishDate),
          audience: event.audience.id,
          stage: event.stageId ? event.stageId : 0,
          scoreType: scoreType,
          markStrategy: event.markStrategy
            ? event.markStrategy.id.toString()
            : markStrategies[0].id.toString(),
          criterias: event.criterias.map((criteria) => ({
            id: criteria.id,
            name: criteria.name,
          })),
          teams: event.teams.map((team) => ({
            id: team.id,
            name: team.name,
          })),
          teachers: event.teachers.map((teacher) => ({
            id: teacher.id,
            name: teacher.name,
          })),
        });
      } else {
        reset({
          scoreType: 'withoutMarkStrategy',
          markStrategy: markStrategies[0].id.toString(),
        });
      }
    }
  }, [event, markStrategies]);

  const handleResponseError = (error: FetchBaseQueryError) => {
    const errorData = (error as FetchBaseQueryError).data as {
      start_dt?: string[];
      finish_dt?: string[];
    };
    if (errorData && errorData.start_dt) {
      setError('startDate', {
        type: 'custom',
        message: errorData.start_dt[0],
      });
    } else if (errorData && errorData.finish_dt) {
      setError('finishDate', {
        type: 'custom',
        message: errorData.finish_dt[0],
      });
    } else {
      toast('Произошла серверная ошибка', {
        type: 'error',
      });
    }
  };

  const onSubmit = async (data: ManageEventFormFields) => {
    const scoreType = data.scoreType;
    if (
      scoreType === 'withCriterias' &&
      (!data.criterias || data.criterias.length === 0)
    ) {
      setError('criterias', {
        type: 'custom',
        message: 'Необходимо установить минимум один критерий',
      });
      return;
    }

    let scoreRequestBody: {
      markStrategyId: number | null;
      criteriaIds: number[];
    };
    switch (scoreType) {
      case 'withoutMarkStrategy':
        scoreRequestBody = {
          markStrategyId: null,
          criteriaIds: [],
        };
        break;
      case 'withMarkStrategy':
        scoreRequestBody = {
          markStrategyId: Number(data.markStrategy),
          criteriaIds: [],
        };
        break;
      case 'withCriterias':
        scoreRequestBody = {
          markStrategyId: Number(data.markStrategy),
          criteriaIds: data.criterias.map((criteria) => criteria.id),
        };
        break;
    }

    if (intensiveId) {
      if (event) {
        const { data: responseData, error: responseError } = await updateEvent({
          intensiveId: parseInt(intensiveId),
          eventId: event.id,
          name: data.name,
          description: data.description,
          startDate: transformSeparateDateAndTimeToISO(
            data.startDate,
            data.startTime
          ),
          finishDate: transformSeparateDateAndTimeToISO(
            data.startDate,
            data.finishTime
          ),
          stageId: data.stage == 0 ? null : data.stage,
          audienceId: data.audience,
          visibility: event.visibility,
          teacherIds: data.teachers
            ? data.teachers.map((teacher) => teacher.id)
            : [],
          teamIds: data.teams ? data.teams.map((team) => team.id) : [],
          ...scoreRequestBody,
        });

        if (responseData) {
          setSuccessfulSaveModal({
            status: true,
            eventId: event.id,
          });
        }

        if (responseError) {
          handleResponseError(responseError as FetchBaseQueryError);
        }
      } else {
        const { data: responseData, error: responseError } = await createEvent({
          intensiveId: parseInt(intensiveId),
          name: data.name,
          description: data.description,
          startDate: transformSeparateDateAndTimeToISO(
            data.startDate,
            data.startTime
          ),
          finishDate: transformSeparateDateAndTimeToISO(
            data.startDate,
            data.finishTime
          ),
          stageId: data.stage == 0 ? null : data.stage,
          audienceId: data.audience,
          visibility: true,
          teacherIds: data.teachers
            ? data.teachers.map((teacher) => teacher.id)
            : [],
          teamIds: data.teams ? data.teams.map((team) => team.id) : [],
          ...scoreRequestBody,
        });

        if (responseData) {
          setSuccessfulSaveModal({
            status: true,
            eventId: (
              responseData as {
                id: number;
              }
            ).id,
          });
        }

        if (responseError) {
          handleResponseError(responseError as FetchBaseQueryError);
        }
      }
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />

      {cancelModal && (
        <Modal
          title="Вы уверены, что хотите прекратить редактирование?"
          onCloseModal={() => setCancelModal(false)}
        >
          <p className="text-lg text-bright_gray">
            Вы уверены, что хотите прекратить редактирование? Все сделанные вами
            изменения не будут сохранены.
          </p>
          <div className="flex justify-end gap-3 mt-6">
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
                  if (intensiveId) {
                    navigate(
                      `/manager/${intensiveId}/schedule/${searchParams.get(
                        'eventId'
                      )}`
                    );
                  }
                }}
                children="Отменить"
              />
            </div>
          </div>
        </Modal>
      )}

      {successfulSaveModal.status && (
        <Modal
          title={`Мероприятие было успешно ${event ? 'изменено' : 'создано'}`}
          onCloseModal={() => {
            navigate(
              `/manager/${intensiveId}/schedule/${successfulSaveModal.eventId}`
            );
            setSuccessfulSaveModal({
              status: false,
              eventId: null,
            });
          }}
        >
          <p className="text-lg text-bright_gray">
            {`Мероприятие было успешно ${event ? 'изменено' : 'создано'}`}
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <div>
              <PrimaryButton
                clickHandler={() => {
                  navigate(
                    `/manager/${intensiveId}/schedule/${successfulSaveModal.eventId}`
                  );
                  setSuccessfulSaveModal({
                    status: false,
                    eventId: null,
                  });
                }}
                children="Закрыть"
              />
            </div>
          </div>
        </Modal>
      )}

      <div className="flex justify-center max-w-[1280px]">
        <form
          className="max-w-[765px] w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Title
            text={event ? 'Редактировать мероприятие' : 'Создать Мероприятие'}
          />

          <div className="flex flex-col gap-3 my-3">
            <div className="text-xl font-bold">Мероприятие</div>

            <InputDescription
              fieldName="name"
              register={register}
              registerOptions={{
                required: 'Поле обязательно для заполнения',
                minLength: {
                  value: 4,
                  message: 'Минимальное количество символов - 4',
                },
                maxLength: {
                  value: 50,
                  message: 'Максимальное количество символов - 50',
                },
              }}
              description="Название мероприятия"
              placeholder="Название мероприятия"
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
              description="Описание мероприятия"
              placeholder="Описание мероприятия"
              errorMessage={
                typeof errors.description?.message === 'string'
                  ? errors.description.message
                  : ''
              }
            />

            {stagesToChoose && (
              <>
                <div className="text-xl font-bold">Этап</div>

                <Select
                  register={register}
                  fieldName="stage"
                  initialText="Выберите к какому этапу привязать мероприятие или оставьте пустым"
                  options={stagesToChoose.map((stage) => ({
                    id: stage.id,
                    name: `${
                      stage.name
                    } ${stage.startDate.toLocaleDateString()} - ${stage.finishDate.toLocaleDateString()}`,
                  }))}
                />
              </>
            )}

            <div className="text-xl font-bold">Время проведения</div>

            <div>
              <InputDescription
                fieldName="startDate"
                register={register}
                registerOptions={{
                  required: 'Поле обязательно для заполнения',
                }}
                description="Дата проведения"
                placeholder="Дата проведения"
                type="date"
                errorMessage={
                  typeof errors.startDate?.message === 'string'
                    ? errors.startDate.message
                    : ''
                }
              />
            </div>

            <div className="flex justify-between gap-2.5">
              <InputDescription
                fieldName="startTime"
                register={register}
                registerOptions={{
                  required: 'Поле обязательно для заполнения',
                }}
                description="Время начала"
                placeholder="Время начала"
                type="time"
                errorMessage={
                  typeof errors.startTime?.message === 'string'
                    ? errors.startTime.message
                    : ''
                }
              />
              <InputDescription
                fieldName="finishTime"
                register={register}
                registerOptions={{
                  required: 'Поле обязательно для заполнения',
                }}
                description="Время окончания"
                placeholder="Время окончания"
                type="time"
                errorMessage={
                  typeof errors.finishTime?.message === 'string'
                    ? errors.finishTime.message
                    : ''
                }
              />
            </div>

            {audiencesToChoose && (
              <>
                <div className="text-xl font-bold">Место проведения</div>
                <Select
                  initialText="Выберите место проведения"
                  options={audiencesToChoose}
                  register={register}
                  registerOptions={{
                    validate: {
                      equalZero: (value: string, formValues) =>
                        value != '0' || 'Поле обязательно для заполнения',
                    },
                  }}
                  fieldName="audience"
                  errorMessage={
                    typeof errors.audience?.message === 'string'
                      ? errors.audience.message
                      : ''
                  }
                />
              </>
            )}

            <div className="text-xl font-bold">Участники</div>

            {teamsToChoose && teamsToChoose.length > 0 && (
              <Controller
                name="teams"
                control={control}
                render={({ field }) => (
                  <MultipleSelectInput
                    description="Команды"
                    items={teamsToChoose.map((team) => ({
                      id: team.id,
                      name: team.name,
                    }))}
                    selectedItems={field.value || []}
                    setSelectedItems={field.onChange}
                  />
                )}
              />
            )}

            {teachersToChoose && teachersToChoose.length > 0 && (
              <Controller
                name="teachers"
                control={control}
                render={({ field }) => (
                  <MultipleSelectInput
                    description="Преподаватели"
                    items={teachersToChoose}
                    selectedItems={field.value || []}
                    setSelectedItems={field.onChange}
                  />
                )}
              />
            )}

            <div className="text-xl font-bold">Оценивание</div>

            <div className="flex flex-col gap-3 mt-3">
              <InputRadio
                register={register}
                fieldName="scoreType"
                value="withoutMarkStrategy"
                currentValue={formValues.scoreType}
                description="Без оценивания"
              />
              <InputRadio
                register={register}
                fieldName="scoreType"
                value="withMarkStrategy"
                currentValue={formValues.scoreType}
                description="Оценивание по шкале"
              >
                {renderMarkStrategies(
                  markStrategies,
                  register,
                  formValues.markStrategy
                )}
              </InputRadio>
              <InputRadio
                register={register}
                value="withCriterias"
                fieldName="scoreType"
                currentValue={formValues.scoreType}
                description="Оценивание по шкале с критериями"
              >
                {renderMarkStrategies(
                  markStrategies,
                  register,
                  formValues.markStrategy
                )}

                {criterias && (
                  <div className="mt-3">
                    <Controller
                      name="criterias"
                      control={control}
                      render={({ field }) => (
                        <MultipleSelectInput
                          description="Список критериев"
                          items={criterias}
                          selectedItems={field.value || []}
                          setSelectedItems={field.onChange}
                          errorMessage={
                            typeof errors.criterias?.message === 'string'
                              ? errors.criterias.message
                              : ''
                          }
                        />
                      )}
                    />
                  </div>
                )}
              </InputRadio>
            </div>

            <FileUpload />
          </div>

          <div className="flex my-5 gap-7">
            <PrimaryButton
              buttonColor="gray"
              type="button"
              children="Отмена"
              clickHandler={() => {
                setCancelModal(true);
              }}
            />

            <PrimaryButton
              type="submit"
              children={
                event ? 'Редактировать мероприятие' : 'Добавить мероприятие'
              }
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default ManageEventForm;
