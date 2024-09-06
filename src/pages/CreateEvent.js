import { useEffect, useState } from 'react';
import { InputDescription } from '../components/InputDescription';
import { ChooseModal } from '../components/ChooseModal';
import SideMenu from '../components/SideMenu';
import PostService from '../API/PostService';
import { Link } from 'react-router-dom';
import { SelectDescription } from '../components/SelectDescription';
import { InputRadioDescription } from '../components/InputRadioDescription';
import { InputRadio } from '../components/InputRadio';
import {
  convertDateFormat,
  convertBackDateFormat,
  filterNotIncludeObjectsByNames,
  filterIncludeObjectsByNames,
} from '../utils';

const CreateEvent = () => {
  const [hasEvent, setHasEvent] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [windowCommands, setWindowCommands] = useState(false);
  const [windowTeachers, setWindowTeachers] = useState(false);
  const [itemsWindow, setItemsWindow] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [responseCommands, setResponseCommands] = useState([]);
  const [responseTeachers, setResponseTeachers] = useState([]);
  const [responseStage, setResponseStages] = useState([]);
  const [responseAuditorii, setResponseAuditorii] = useState([]);
  const [commands, setCommands] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [auditorii, setAuditorii] = useState('');
  const [typeScore, setTypeScore] = useState(1);
  const [stage, setStage] = useState('');
  const [typeResult, setTypeResult] = useState(1);

  useEffect(() => {
    setIsOpen(windowTeachers || windowCommands);
    windowTeachers
      ? setItemsWindow([...responseTeachers])
      : setItemsWindow([...responseCommands]);
  }, [windowTeachers, windowCommands]);

  useEffect(() => {
    const fetchData = async () => {
      const idIntensive = localStorage.getItem('id');
      await Promise.allSettled([
        PostService.getCommandsOnIntensive(idIntensive),
        PostService.getTeachersOnIntensive(idIntensive),
        PostService.getAuditorii(),
        PostService.getStage(idIntensive),
        PostService.getEvent(localStorage.getItem('idEvent')),
      ]).then((response) => {
        console.log('response', response);
        setResponseCommands(
          response[0].value.data.results.map((command) => {
            return { id: command.id, name: command.name };
          })
        );
        setResponseTeachers(
          response[1].value.data.results.map((teacher) => {
            return { id: teacher.id, name: teacher.teacher.user.last_name };
          })
        );
        setResponseAuditorii(
          response[2].value.data.results.map((audit) => {
            return {
              id: audit.id,
              name:
                audit.building.address +
                ' Корпус ' +
                audit.building.name +
                ' Аудитория ' +
                audit.name,
            };
          })
        );
        setResponseStages(
          response[3].value.data.results.map((stage) => {
            return {
              id: stage.id,
              name: stage.name,
            };
          })
        );
        if (response[4].status === 'fulfilled') {
          console.log('hhdhf', response[4]);
          setHasEvent(true);
          setEventName(response[4].value.data.name);
          setEventDescription(response[4].value.data.description);
          setDateStart(convertBackDateFormat(response[4].value.data.start_dt))(
            response[4].value.data.finish_dt
          )
            ? setDateEnd(
                convertBackDateFormat(response[4].value.data.finish_dt)
              )
            : setDateEnd('');
          setCommands(
            filterIncludeObjectsByNames(
              response[0].value.data.results,
              response[4].value.data.commands
            )
          );
          setResponseCommands(
            filterNotIncludeObjectsByNames(
              response[0].value.data.results,
              response[4].value.data.commands
            )
          );
          setTeachers(
            response[4].value.data.teachers_command.map((teacher) => {
              return { id: teacher };
            })
          );
        }
      });
    };

    if (!PostService.token) {
      window.location.href = '/';
    }
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response;
    try {
      if (!eventName && !eventDescription && !dateEnd && !dateStart)
        throw new Error(
          'Необходимо заполнить поля: intensiveName, intensiveDescription, dateEnd, dateStart'
        );
      const ids_commands = commands?.map((item) => item.id);
      const ids_teachers = teachers?.map((item) => item.id);
      console.log('commands', commands);
      console.log('teachers', teachers);
      console.log(eventName, stage, auditorii, typeScore, typeResult);
      const response = hasEvent
        ? await PostService.patchEvent(
            eventName,
            eventDescription,
            convertDateFormat(dateStart),
            convertDateFormat(dateEnd),
            ids_teachers,
            ids_commands,
            stage,
            auditorii,
            typeScore,
            typeResult
          )
        : await PostService.postEvent(
            eventName,
            eventDescription,
            convertDateFormat(dateStart),
            convertDateFormat(dateEnd),
            ids_teachers,
            ids_commands,
            stage,
            auditorii,
            typeScore,
            typeResult
          );
      if (response) {
        localStorage.setItem('idEvent', response.data.id);
        window.location.href = '/editEvent';
      } else {
      }
    } catch (error) {
      console.log(response);
      alert(error);
    }
  };

  console.log(responseStage);
  return (
    <div className="body">
      <SideMenu />
      <div className="main-block">
        <div className="center-block">
          <ChooseModal
            items={itemsWindow}
            itemsForResults={windowTeachers ? teachers : commands}
            isOpen={isOpen}
            onClose={windowTeachers ? setWindowTeachers : setWindowCommands}
            onSave={windowTeachers ? setTeachers : setCommands}
          />
          <div className="list-content column-container">
            <div className="title">
              <div className="font-32">
                {hasEvent ? 'Редактировать мероприятие' : 'Создать Мероприятие'}
              </div>
            </div>
            <div className="column-container">
              <div className="element-list-input">
                <div className="font-18 bold-font">Мероприятие</div>
              </div>
              <form>
                <InputDescription
                  valueProp={eventName}
                  onChange={setEventName}
                  descriptionProp={'Название мероприятия'}
                />
                <InputDescription
                  valueProp={eventDescription}
                  onChange={setEventDescription}
                  descriptionProp={'Описание мероприятия'}
                />
                <div className="element-list-input">
                  <div className="font-18 bold-font">Время проведения</div>
                </div>
                <div className="displey-row">
                  <InputDescription
                    valueProp={dateStart}
                    onChange={setDateStart}
                    descriptionProp={'Дата начала'}
                    typeProp={'date'}
                  />
                  <InputDescription
                    valueProp={dateEnd}
                    onChange={setDateEnd}
                    descriptionProp={'Дата окончания'}
                    typeProp={'date'}
                  />
                </div>
                <div className="displey-row">
                  <InputDescription
                    valueProp={timeStart}
                    onChange={setTimeStart}
                    descriptionProp={'Время начала'}
                    typeProp={'time'}
                  />
                  <InputDescription
                    valueProp={timeEnd}
                    onChange={setTimeEnd}
                    descriptionProp={'Время окончания'}
                    typeProp={'time'}
                  />
                </div>
                <div className="element-list-input">
                  <div className="font-18 bold-font"> Место проведения</div>
                </div>
                <SelectDescription
                  placeholderProp={'Выберите место проведения'}
                  option={responseAuditorii}
                  value={auditorii}
                  listName={'пока'}
                  onChange={setAuditorii}
                />

                <div className="element-list-input">
                  <div className="font-18 bold-font">Этап</div>
                </div>
                {responseStage.length > 0 ? (
                  <SelectDescription
                    placeholderProp={
                      'Выберите к какому этапу привязать мероприятие'
                    }
                    listName={'привет'}
                    option={responseStage}
                    value={stage}
                    onChange={setStage}
                  />
                ) : (
                  <span className="text-[#6B7280]">
                    {' '}
                    На данный момент не создано ни одного этапа{' '}
                  </span>
                )}

                <div className="element-list-input">
                  <div className="font-18 bold-font">Участники</div>
                </div>

                <div className="element-list-input column-container">
                  <div className="">Команды</div>
                  <div className="flex flex-wrap">
                    {commands.length > 0
                      ? commands.map((item) => (
                          <div
                            key={item.name}
                            className="ml-4 text-sm selectedInList"
                          >
                            {item.name}
                          </div>
                        ))
                      : null}
                  </div>
                  <div className="flex align-center">
                    <button
                      className="button-classic button-classic-dop"
                      type="button"
                      onClick={() => setWindowCommands(true)}
                    >
                      {' '}
                      Выбрать{' '}
                    </button>
                    {commands.length > 0 ? null : (
                      <span
                        style={{ height: 'max-content', marginLeft: '20px' }}
                        className="text-[#6B7280]"
                      >
                        Выберите команды
                      </span>
                    )}
                  </div>
                </div>

                <div className="element-list-input column-container">
                  <div className="">Список участвующих преподавателей</div>
                  <div className="flex flex-wrap">
                    {teachers.length > 0
                      ? teachers.map((item) => (
                          <div
                            key={item.id}
                            className="ml-4 text-sm selectedInList"
                          >
                            {item.name}
                          </div>
                        ))
                      : null}
                  </div>
                  <div className="flex align-center">
                    <button
                      className="button-classic button-classic-dop"
                      type="button"
                      onClick={() => setWindowTeachers(true)}
                    >
                      {' '}
                      Выбрать{' '}
                    </button>
                    {commands.length > 0 ? null : (
                      <span
                        style={{ height: 'max-content', marginLeft: '20px' }}
                        className="text-[#6B7280]"
                      >
                        Выберите участвующив в мероприятии преподавателей
                      </span>
                    )}
                  </div>
                </div>
                <div className="element-list-input">
                  <div className="font-18 bold-font"> Оценивание</div>
                </div>

                <InputRadioDescription
                  setTypeProp={setTypeScore}
                  descriptionProp={'Тип оценивания'}
                />

                <div className="element-list-input">
                  <div className="font-18 bold-font">
                    {' '}
                    Результат мероприятия
                  </div>
                </div>

                <div className="element-list-input column-container">
                  <div className=""></div>
                  <InputRadio
                    nameProp={'typeResult'}
                    valueProp={typeResult}
                    funcProp={setTypeResult}
                    descriptionProp={'Без результатов'}
                  />
                  <InputRadio
                    nameProp={'typeResult'}
                    valueProp={typeResult}
                    funcProp={setTypeResult}
                    descriptionProp={'Ответ в виде файла или ссылки'}
                  />
                </div>

                <div className="element-list-input">
                  <Link
                    className="button-classic margin element-list-input"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    {hasEvent
                      ? 'Редактировать мероприятие'
                      : 'Создать мероприятие'}
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
