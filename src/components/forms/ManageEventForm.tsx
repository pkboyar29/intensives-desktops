import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { replaceLastURLSegment } from '../../helpers/urlHelpers';
import { getISODateInUTC3, getTimeFromDate } from '../../helpers/dateHelpers';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { useLazyGetTeamsQuery } from '../../redux/api/teamApi';
import { useLazyGetStagesForIntensiveQuery } from '../../redux/api/stageApi';
import { useLazyGetAudiencesQuery } from '../../redux/api/audienceApi';
import { useLazyGetTeachersOnIntensiveQuery } from '../../redux/api/teacherApi';
import {
  useLazyGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
} from '../../redux/api/eventApi';

import Select from '../inputs/Select';
import InputDescription from '../inputs/InputDescription';
import MultipleSelectInput from '../inputs/MultipleSelectInput';
import Title from '../Title';
import PrimaryButton from '../PrimaryButton';
import Modal from '../modals/Modal';
import FileUpload from '../inputs/FileInput';
import ScoreTypeBox from '../inputs/ScoreTypeBox';

interface ManageEventFormFields {
  name: string;
  description: string;
  startDate: string;
  finishDate: string;
  startTime: string;
  finishTime: string;
  audience: number;
  stage: number;
  // scoreType: 1 | 2 | 3;
}

interface Item {
  id: number;
  name: string;
}

const ManageEventForm: FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ManageEventFormFields>({
    mode: 'onBlur',
  });

  const [getStagesForIntensive] = useLazyGetStagesForIntensiveQuery();
  const [getAudiences] = useLazyGetAudiencesQuery();
  const [getTeams] = useLazyGetTeamsQuery();
  const [getTeachersOnIntensive] = useLazyGetTeachersOnIntensiveQuery();
  const [createEvent] = useCreateEventMutation();
  const [updateEvent] = useUpdateEventMutation();
  const [getEvent] = useLazyGetEventQuery();

  const [cancelModal, setCancelModal] = useState<boolean>(false);

  const [teamsToChoose, setTeamsToChoose] = useState<Item[]>([]);
  const [teachersToChoose, setTeachersToChoose] = useState<Item[]>([]);
  const [stagesToChoose, setStagesToChoose] = useState<Item[]>([]);
  const [audiencesToChoose, setAudiencesToChoose] = useState<Item[]>([]);

  const [selectedTeams, setSelectedTeams] = useState<Item[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<Item[]>([]);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { intensiveId } = useParams();

  const hasEvent = searchParams.get('eventId');

  useEffect(() => {
    const fetchData = async () => {
      if (intensiveId) {
        const { data: teamsToChoose } = await getTeams(Number(intensiveId));
        const { data: teachersToChoose } = await getTeachersOnIntensive(
          Number(intensiveId)
        );
        const { data: audiencies } = await getAudiences();
        const { data: stages } = await getStagesForIntensive(
          Number(intensiveId)
        );

        if (teamsToChoose) {
          setTeamsToChoose(
            teamsToChoose.map((team) => ({
              id: team.index,
              name: team.name,
            }))
          );
        }

        if (teachersToChoose) {
          setTeachersToChoose(teachersToChoose);
        }

        if (audiencies) {
          setAudiencesToChoose(audiencies);
        }

        if (stages) {
          setStagesToChoose(
            stages.map((stage) => ({
              id: stage.id,
              name: `${
                stage.name
              } ${stage.startDate.toLocaleDateString()} - ${stage.finishDate.toLocaleDateString()}`,
            }))
          );
        }

        const eventId: string | null = searchParams.get('eventId');

        if (hasEvent && eventId) {
          const { data: event } = await getEvent(Number(eventId));

          if (event) {
            setSelectedTeams(
              event.teams.map((team) => ({
                id: team.index,
                name: team.name,
              }))
            );

            setSelectedTeachers(
              event.experts.map((expert) => ({
                id: expert.teacherOnIntensiveId,
                name: expert.name,
              }))
            );

            setValue('name', event.name);
            setValue('description', event.description);
            setValue('startDate', getISODateInUTC3(event.startDate));
            setValue('finishDate', getISODateInUTC3(event.finishDate));
            setValue('startTime', getTimeFromDate(event.startDate));
            setValue('finishTime', getTimeFromDate(event.finishDate));
            setValue('audience', event.audience.id);
            setValue('stage', event.stageId);
          }
        }
      }
    };

    fetchData();
  }, []);

  const handleResponseError = (error: FetchBaseQueryError) => {
    const errorData = (error as FetchBaseQueryError).data as {
      start_dt?: string[];
      finish_dt?: string[];
    };
    if (errorData.start_dt) {
      setError('startDate', {
        type: 'custom',
        message: errorData.start_dt[0],
      });
    }
    if (errorData.finish_dt) {
      setError('finishDate', {
        type: 'custom',
        message: errorData.finish_dt[0],
      });
    }
  };

  const onSubmit = async (data: ManageEventFormFields) => {
    const teamIds = selectedTeams.map((team) => team.id);
    const teacherOnIntensiveIds = selectedTeachers.map((teacher) => teacher.id);

    const eventId: string | null = searchParams.get('eventId');

    // TODO: get here currentScoreType
    // console.log(currentScoreType);

    if (intensiveId) {
      if (hasEvent) {
        if (eventId) {
          const { data: responseData, error: responseError } =
            await updateEvent({
              intensiveId: parseInt(intensiveId),
              eventId: parseInt(eventId),
              name: data.name,
              description: data.description,
              startDate: data.startDate,
              startTime: data.startTime,
              finishDate: data.finishDate,
              finishTime: data.finishTime,
              stage: data.stage == 0 ? null : data.stage,
              audience: data.audience,
              teacherOnIntensiveIds,
              teamIds,
              markStrategy: 1,
            });

          if (responseData) {
            navigate(replaceLastURLSegment(''));
          }

          if (responseError) {
            handleResponseError(responseError as FetchBaseQueryError);
          }
        }
      } else {
        const { data: responseData, error: responseError } = await createEvent({
          intensiveId: parseInt(intensiveId),
          name: data.name,
          description: data.description,
          startDate: data.startDate,
          startTime: data.startTime,
          finishDate: data.finishDate,
          finishTime: data.finishTime,
          stage: data.stage == 0 ? null : data.stage,
          audience: data.audience,
          teacherOnIntensiveIds,
          teamIds,
          markStrategy: 1,
        });

        if (responseData) {
          navigate(replaceLastURLSegment(''));
        }

        if (responseError) {
          handleResponseError(responseError as FetchBaseQueryError);
        }
      }
    }
  };

  return (
    <>
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
                      `/manager/${parseInt(
                        intensiveId
                      )}/schedule/${searchParams.get('eventId')}`
                    );
                  }
                }}
                children="Да"
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
            text={
              hasEvent ? 'Редактировать мероприятие' : 'Создать Мероприятие'
            }
          />

          <div className="my-3 text-xl font-bold">Мероприятие</div>

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

          <div className="my-3 text-xl font-bold">Время проведения</div>

          <div className="flex justify-between gap-2.5">
            <InputDescription
              fieldName="startDate"
              register={register}
              registerOptions={{
                required: 'Поле обязательно для заполнения',
              }}
              description="Дата начала"
              placeholder="Дата начала"
              type="date"
              errorMessage={
                typeof errors.startDate?.message === 'string'
                  ? errors.startDate.message
                  : ''
              }
            />
            <InputDescription
              fieldName="finishDate"
              register={register}
              registerOptions={{
                required: 'Поле обязательно для заполнения',
              }}
              description="Дата окончания"
              placeholder="Дата окончания"
              type="date"
              errorMessage={
                typeof errors.finishDate?.message === 'string'
                  ? errors.finishDate.message
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

          <div className="my-3 text-xl font-bold">Место проведения</div>

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

          <div className="my-3 text-xl font-bold">Этап</div>

          <Select
            register={register}
            fieldName="stage"
            initialText="Выберите к какому этапу привязать мероприятие или оставьте пустым"
            options={stagesToChoose}
          />

          <div className="my-3 text-xl font-bold">Участники</div>

          {teamsToChoose.length > 0 && (
            <div className="mt-3">
              <MultipleSelectInput
                description="Команды"
                items={teamsToChoose}
                selectedItems={selectedTeams}
                setSelectedItems={setSelectedTeams}
              />
            </div>
          )}

          {teachersToChoose.length > 0 && (
            <div className="mt-3">
              <MultipleSelectInput
                description="Эксперты"
                items={teachersToChoose}
                selectedItems={selectedTeachers}
                setSelectedItems={setSelectedTeachers}
              />
            </div>
          )}

          <div className="my-3 text-xl font-bold">Оценивание</div>

          <ScoreTypeBox />

          <div className="my-3">
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
                hasEvent ? 'Редактировать мероприятие' : 'Добавить мероприятие'
              }
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default ManageEventForm;
