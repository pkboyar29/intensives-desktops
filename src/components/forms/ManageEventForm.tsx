import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PostService from '../../API/PostService';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { replaceLastURLSegment } from '../../helpers/urlHelpers';

import { convertBackDateFormat } from '../../utils';
import {
  transformISODateToTime,
  transformSeparateDateAndTimeToISO,
} from '../../helpers/dateHelpers';

import Select from '../Select';
import InputRadioDescription from '../InputRadioDescription';
import InputRadio from '../InputRadio';
import InputDescription from '../InputDescription';
import ChooseModal from '../ChooseModal';

import Title from '../Title/Title';

interface ManageEventFormFields {
  name: string;
  description: string;
  dateStart: string;
  dateEnd: string;
  timeStart: string;
  timeEnd: string;
  audience: number;
  stage: number;
}

const ManageEventForm: FC = () => {
  const { register, handleSubmit, setValue } = useForm<ManageEventFormFields>({
    mode: 'onBlur',
  });

  const [teamsToChoose, setTeamsToChoose] = useState<any[]>([]);
  const [teachersToChoose, setTeachersToChoose] = useState<any[]>([]);
  const [stagesToChoose, setStagesToChoose] = useState<any[]>([]);
  const [audiencesToChoose, setAudiencesToChoose] = useState<any[]>([]);

  const [teams, setTeams] = useState<any[]>([]);
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
      const { data: teams } = await PostService.getCommandsOnIntensive(
        intensiveId
      );
      const { data: teachers } = await PostService.getTeachersOnIntensive(
        intensiveId
      );
      const { data: audiencies } = await PostService.getAudiences();
      const { data: stages } = await PostService.getStages();

      setTeamsToChoose(
        teams.results.map((team: any) => {
          return { id: team.id, name: team.name };
        })
      );

      setTeachersToChoose(
        teachers.results.map((teacher: any) => {
          return { id: teacher.id, name: teacher.teacher.user.last_name };
        })
      );

      // setCommands(filterIncludeObjectsByNames(teams, event.commands));
      // setResponseCommands(filterIncludeObjectsByNames(teams, event.commands));
      // setTeachers(
      //   event.teachers_command.map((teacher) => {
      //     return { id: teacher };
      //   })
      // );

      setAudiencesToChoose(
        audiencies.results.map((audience: any) => {
          return {
            id: audience.id,
            name:
              audience.building.address +
              ' Корпус ' +
              audience.building.name +
              ' Аудитория ' +
              audience.name,
          };
        })
      );

      setStagesToChoose(
        stages.results.map((stage: any) => {
          return {
            id: stage.id,
            name: stage.name,
          };
        })
      );

      if (hasEvent) {
        const { data: event } = await PostService.getEvent(
          searchParams.get('eventId')
        );

        setValue('name', event.name);
        setValue('description', event.description);
        setValue('dateStart', convertBackDateFormat(event.start_dt));
        setValue('dateEnd', convertBackDateFormat(event.finish_dt));
        setValue('timeStart', transformISODateToTime(event.start_dt));
        setValue('timeEnd', transformISODateToTime(event.finish_dt));
        setValue('audience', event.auditory);
        setValue('stage', event.stage);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: ManageEventFormFields) => {
    console.log(data);

    try {
      const ids_teachers = teachers?.map((item) => item.id);
      const ids_commands = teams?.map((item) => item.id);

      if (hasEvent) {
        await PostService.patchEvent(
          searchParams.get('eventId'),
          data.name,
          data.description,
          transformSeparateDateAndTimeToISO(data.dateStart, data.timeStart),
          transformSeparateDateAndTimeToISO(data.dateEnd, data.timeEnd),
          data.stage,
          data.audience,
          ids_teachers,
          ids_commands,
          typeScore,
          typeResult
        );
      } else {
        await PostService.createEvent(
          data.name,
          data.description,
          transformSeparateDateAndTimeToISO(data.dateStart, data.timeStart),
          transformSeparateDateAndTimeToISO(data.dateEnd, data.timeEnd),
          data.stage,
          data.audience,
          ids_teachers,
          ids_commands
        );
      }

      navigate(replaceLastURLSegment('plan'));
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

      <div className="flex justify-center min-h-screen min-w-[50vw] max-w-[1280px]">
        <div className="list-content">
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
                fieldName="dateStart"
                register={register}
                description="Дата начала"
                placeholder="Дата начала"
                type="date"
              />
              <InputDescription
                fieldName="dateEnd"
                register={register}
                description="Дата окончания"
                placeholder="Дата окончания"
                type="date"
              />
            </div>

            <div className="flex justify-between gap-2.5">
              <InputDescription
                fieldName="timeStart"
                register={register}
                description="Время начала"
                placeholder="Время начала"
                type="time"
              />
              <InputDescription
                fieldName="timeEnd"
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

            {stagesToChoose.length > 0 ? (
              <Select
                register={register}
                fieldName="stage"
                initialText="Выберите к какому этапу привязать мероприятие"
                options={stagesToChoose}
              />
            ) : (
              <span className="text-[#6B7280]">
                {' '}
                На данный момент не создано ни одного этапа{' '}
              </span>
            )}

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
                  className="bg-[#1a5ce5] text-white px-4 py-1.5 rounded-[10px] flex justify-center"
                  type="button"
                  onClick={() => setModalTeams(true)}
                >
                  {' '}
                  Выбрать{' '}
                </button>

                {teams.length === 0 && (
                  <span className="text-[#6B7280]">
                    Выберите участвующих в мероприятии команды
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 text-lg">
              <div>Список участвующих преподавателей</div>
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
                  className="bg-[#1a5ce5] text-white px-4 py-1.5 rounded-[10px] flex justify-center"
                  type="button"
                  onClick={() => setModalTeachers(true)}
                >
                  {' '}
                  Выбрать{' '}
                </button>
                {teams.length === 0 && (
                  <span className="text-[#6B7280]">
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
              <button
                className="bg-[#1a5ce5] text-white px-4 py-2.5 rounded-[10px] flex justify-center w-full"
                type="submit"
              >
                {hasEvent
                  ? 'Редактировать мероприятие'
                  : 'Добавить мероприятие'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ManageEventForm;
