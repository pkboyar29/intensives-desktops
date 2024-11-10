import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { replaceLastURLSegment } from '../../helpers/urlHelpers';
import { getISODateInUTC3, getTimeFromDate } from '../../helpers/dateHelpers';

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
import InputRadioDescription from '../inputs/InputRadioDescription';
import TrueInputRadio from '../inputs/TrueInputRadio';
import InputDescription from '../inputs/InputDescription';
import MultipleSelectInput from '../inputs/MultipleSelectInput';
import Title from '../Title';
import PrimaryButton from '../PrimaryButton';
import Modal from '../modals/Modal';

interface ManageEventFormFields {
  name: string;
  description: string;
  startDate: string;
  finishDate: string;
  startTime: string;
  finishTime: string;
  audience: number;
  stage: number;
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

  // TODO: start getting mark strategies from api?
  // TODO: rename to markStrategy?
  const [typeScore, setTypeScore] = useState<number>(1);

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

  const onSubmit = async (data: ManageEventFormFields) => {
    const teamIds = selectedTeams.map((team) => team.id);
    const teacherOnIntensiveIds = selectedTeachers.map((teacher) => teacher.id);

    try {
      const eventId: string | null = searchParams.get('eventId');

      if (intensiveId) {
        if (hasEvent) {
          if (eventId) {
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
          }
        } else {
          await createEvent({
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
        }
      }

      navigate(replaceLastURLSegment(''));
    } catch (e) {
      console.log(e);
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
            description="Описание мероприятия"
            placeholder="Описание мероприятия"
          />

          <div className="my-3 text-xl font-bold">Время проведения</div>

          <div className="flex justify-between gap-2.5">
            <InputDescription
              fieldName="startDate"
              register={register}
              description="Дата начала"
              placeholder="Дата начала"
              type="date"
            />
            <InputDescription
              fieldName="finishDate"
              register={register}
              description="Дата окончания"
              placeholder="Дата окончания"
              type="date"
            />
          </div>

          <div className="flex justify-between gap-2.5">
            <InputDescription
              fieldName="startTime"
              register={register}
              description="Время начала"
              placeholder="Время начала"
              type="time"
            />
            <InputDescription
              fieldName="finishTime"
              register={register}
              description="Время окончания"
              placeholder="Время окончания"
              type="time"
            />
          </div>

          <div className="my-3 text-xl font-bold">Место проведения</div>

          <Select
            initialText="Выберите место проведения"
            options={audiencesToChoose}
            register={register}
            registerOptions={{
              validate: {
                equalZero: (value: string, formValue) =>
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

          <InputRadioDescription setType={setTypeScore} />

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
