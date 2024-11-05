import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { replaceLastURLSegment } from '../../helpers/urlHelpers';

import { useLazyGetTeamsQuery } from '../../redux/api/teamApi';
import { useLazyGetStagesForIntensiveQuery } from '../../redux/api/stageApi';
import { useLazyGetAudiencesQuery } from '../../redux/api/audienceApi';
import { useLazyGetTeachersOnIntensiveQuery } from '../../redux/api/teacherApi';
import {
  useLazyGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
} from '../../redux/api/eventApi';

import { IStage } from '../../ts/interfaces/IStage';
import { IAudience } from '../../ts/interfaces/IAudience';
import { ITeamToChoose } from '../../ts/interfaces/ITeam';

import Select from '../inputs/Select';
import InputRadioDescription from '../inputs/InputRadioDescription';
import InputRadio from '../inputs/InputRadio';
import InputDescription from '../inputs/InputDescription';
import ChooseModal from '../ChooseModal';
import Title from '../Title';
import PrimaryButton from '../PrimaryButton';

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

const ManageEventForm: FC = () => {
  const { register, handleSubmit, setValue } = useForm<ManageEventFormFields>({
    mode: 'onBlur',
  });

  const [getStagesForIntensive] = useLazyGetStagesForIntensiveQuery();
  const [getAudiences] = useLazyGetAudiencesQuery();
  const [getTeams] = useLazyGetTeamsQuery();
  const [getTeachersOnIntensive] = useLazyGetTeachersOnIntensiveQuery();
  const [getEvent] = useLazyGetEventQuery();
  const [createEvent] = useCreateEventMutation();
  const [updateEvent] = useUpdateEventMutation();

  const [teamsToChoose, setTeamsToChoose] = useState<any[]>([]);
  const [teachersToChoose, setTeachersToChoose] = useState<any[]>([]);
  const [stagesToChoose, setStagesToChoose] = useState<IStage[]>([]);
  const [audiencesToChoose, setAudiencesToChoose] = useState<IAudience[]>([]);

  const [teams, setTeams] = useState<ITeamToChoose[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);

  const [typeScore, setTypeScore] = useState<number>(1);
  const [typeResult, setTypeResult] = useState<number>(1);

  const [modalTeams, setModalTeams] = useState<boolean>(false);
  const [modalTeachers, setModalTeachers] = useState<boolean>(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { intensiveId } = useParams();

  const hasEvent = searchParams.get('eventId');

  useEffect(() => {
    const fetchData = async () => {
      if (intensiveId) {
        const { data: teams } = await getTeams(Number(intensiveId));
        const { data: teachers } = await getTeachersOnIntensive(
          Number(intensiveId)
        );
        const { data: audiencies } = await getAudiences();
        const { data: stages } = await getStagesForIntensive(
          Number(intensiveId)
        );

        if (teams) {
          setTeamsToChoose(teams);
        }

        if (teachers) {
          setTeachersToChoose(teachers);
        }

        // setCommands(filterIncludeObjectsByNames(teams, event.commands));
        // setResponseCommands(filterIncludeObjectsByNames(teams, event.commands));
        // setTeachers(
        //   event.teachers_command.map((teacher) => {
        //     return { id: teacher };
        //   })
        // );

        if (audiencies) {
          setAudiencesToChoose(audiencies);
        }

        if (stages) {
          setStagesToChoose(stages);
        }

        const eventId: string | null = searchParams.get('eventId');

        if (hasEvent && eventId) {
          const { data: event } = await getEvent(Number(eventId));

          if (event) {
            setValue('name', event.name);
            setValue('description', event.description);
            setValue('startDate', event.startDate);
            setValue('finishDate', event.finishDate);
            setValue('startTime', event.startTime);
            setValue('finishTime', event.finishTime);
            setValue('audience', event.audience);
            setValue('stage', event.stage);
          }
        }
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: ManageEventFormFields) => {
    console.log(data);

    try {
      const ids_teachers = teachers?.map((item) => item.id);
      const ids_commands = teams?.map((item) => item.id);

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
              auditory: data.audience,
              teachers_command: ids_teachers,
              commands: ids_commands,
              mark_strategy: 1,
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
            auditory: data.audience,
            teachers_command: ids_teachers,
            commands: ids_commands,
            mark_strategy: typeScore,
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
      {modalTeams && (
        <ChooseModal
          itemsProp={teamsToChoose}
          selectedItemsProp={teams}
          onClose={() => setModalTeams(false)}
          onSave={(newSelectedItems: any[], newItemsToChoose: any[]) => {
            setTeams(newSelectedItems);
            setTeamsToChoose(newItemsToChoose);
          }}
        />
      )}

      {modalTeachers && (
        <ChooseModal
          itemsProp={teachersToChoose}
          selectedItemsProp={teachers}
          onClose={() => setModalTeachers(false)}
          onSave={(newSelectedItems: any[], newItemsToChoose: any[]) => {
            setTeachers(newSelectedItems);
            setTeachersToChoose(newItemsToChoose);
          }}
        />
      )}

      <div className="flex justify-center max-w-[1280px]">
        <div className="max-w-[765px] w-full">
          <Title
            text={
              hasEvent ? 'Редактировать мероприятие' : 'Создать Мероприятие'
            }
          />

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="py-3 text-xl font-bold">Мероприятие</div>

            <InputDescription
              fieldName="name"
              register={register}
              description="Название мероприятия"
              placeholder="Название мероприятия"
            />
            <InputDescription
              fieldName="description"
              register={register}
              description="Описание мероприятия"
              placeholder="Описание мероприятия"
            />

            <div className="py-3 text-xl font-bold">Время проведения</div>

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

            <div className="py-3 text-xl font-bold"> Место проведения</div>

            <Select
              initialText="Выберите место проведения"
              options={audiencesToChoose}
              register={register}
              fieldName="audience"
            />

            <div className="py-3 text-xl font-bold">Этап</div>

            <Select
              register={register}
              fieldName="stage"
              initialText="Выберите к какому этапу привязать мероприятие"
              options={stagesToChoose}
            />

            <div className="py-3 text-xl font-bold">Участники</div>

            <div className="text-lg">
              <div>Команды</div>
              <div className="flex flex-wrap gap-1 mt-4">
                {teams.length > 0
                  ? teams.map((item) => (
                      <div key={item.name} className="text-sm selectedInList">
                        {item.name}
                      </div>
                    ))
                  : null}
              </div>
              <div className="flex items-center gap-4 mt-4">
                <button
                  className="bg-blue text-white px-4 py-1.5 rounded-[10px] flex justify-center"
                  type="button"
                  onClick={() => setModalTeams(true)}
                >
                  {' '}
                  Выбрать{' '}
                </button>

                {teams.length === 0 && (
                  <span className="text-gray_3">Выберите экспертов</span>
                )}
              </div>
            </div>

            <div className="mt-4 text-lg">
              <div>Эксперты</div>
              <div className="flex flex-wrap gap-1 mt-4">
                {teachers.length > 0
                  ? teachers.map((item) => (
                      <div key={item.id} className="text-sm selectedInList">
                        {item.name}
                      </div>
                    ))
                  : null}
              </div>

              <div className="flex items-center gap-4 mt-4">
                <button
                  className="bg-blue text-white px-4 py-1.5 rounded-[10px] flex justify-center"
                  type="button"
                  onClick={() => setModalTeachers(true)}
                >
                  {' '}
                  Выбрать{' '}
                </button>
                {teams.length === 0 && (
                  <span className="text-gray_3">
                    Выберите участвующих в мероприятии преподавателей
                  </span>
                )}
              </div>
            </div>

            <div className="py-3 text-xl font-bold">Оценивание</div>

            <InputRadioDescription setTypeProp={setTypeScore} />

            <div className="py-3 text-xl font-bold"> Результат мероприятия</div>

            <div className="flex flex-col gap-3 text-lg">
              <InputRadio
                valueProp={typeResult}
                nameProp={'typeResult'}
                descriptionProp={'Без результатов'}
                funcProp={setTypeResult}
              />
              <InputRadio
                valueProp={typeResult}
                nameProp={'typeResult'}
                descriptionProp={'Ответ в виде файла или ссылки'}
                funcProp={setTypeResult}
              />
            </div>

            <div className="mt-4 text-lg">
              <PrimaryButton
                type="submit"
                text={
                  hasEvent
                    ? 'Редактировать мероприятие'
                    : 'Добавить мероприятие'
                }
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ManageEventForm;
