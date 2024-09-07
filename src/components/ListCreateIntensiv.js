import { useEffect, useState } from 'react';
import SideMenu from './SideMenu';
import { InputDescription } from './InputDescription';
import { ChooseModal } from './ChooseModal';
import PostService from '../API/PostService';
import { Link } from 'react-router-dom';
import {
  convertDateFormat,
  convertBackDateFormat,
  filterNotIncludeObjectsByNames,
  filterIncludeObjectsByNames,
} from '../utils';

const ListCreateIntensiv = (props) => {
  const [hasIntensive, setHasIntensive] = useState(false);
  const [intensiveName, setIntensiveName] = useState('');
  const [intensiveDescription, setIntensiveDescription] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [windowTeachers, setWindowTeachers] = useState(false);
  const [windowFlows, setWindowFlows] = useState(false);
  const [windowStudRoles, setWindowStudRoles] = useState(false);
  const [itemsWindow, setItemsWindow] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [responseFlows, setResponseFlows] = useState([]);
  const [responseTeachers, setResponseTeachers] = useState([]);
  const [responseStudentRoles, setResponseStudentRoles] = useState([]);
  const [flows, setFlows] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [studentRoles, setStudentRoles] = useState([]);

  useEffect(() => {
    setIsOpen(windowTeachers || windowFlows || windowStudRoles);
    windowTeachers
      ? setItemsWindow([...responseTeachers])
      : windowFlows
      ? setItemsWindow([...responseFlows])
      : windowStudRoles
      ? setItemsWindow([...responseStudentRoles])
      : setItemsWindow([]);
  }, [windowTeachers, windowFlows, windowStudRoles]);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.allSettled([
        PostService.getTeachers(),
        PostService.getFlows(),
        PostService.getStudenRoles(),
        PostService.getIntensiv(localStorage.getItem('id')),
      ]).then((response) => {
        console.log('response', response);
        setResponseTeachers(
          response[0].value.data.results.map((teacher) => {
            return { id: teacher.user.id, name: teacher.user.last_name };
          })
        );
        setResponseFlows(response[1].value.data.results);
        console.log(responseFlows);
        setResponseStudentRoles(response[2].value.data.results);
        if (response[3].status === 'fulfilled') {
          console.log('hhdhf', response[3]);
          setHasIntensive(true);
          setIntensiveName(response[3].value.data.name);
          setIntensiveDescription(response[3].value.data.description);
          setDateStart(
            convertBackDateFormat(response[3].value.data.created_at)
          )(response[3].value.data.close_dt)
            ? setDateEnd(convertBackDateFormat(response[3].value.data.close_dt))
            : setDateEnd('');
          setFlows(
            filterIncludeObjectsByNames(
              response[1].value.data.results,
              response[3].value.data.flow
            )
          );
          setResponseFlows(
            filterNotIncludeObjectsByNames(
              response[1].value.data.results,
              response[3].value.data.flow
            )
          );
          setStudentRoles(
            filterIncludeObjectsByNames(
              response[2].value.data.results,
              response[3].value.data.roles
            )
          );
          setResponseStudentRoles(
            filterNotIncludeObjectsByNames(
              response[2].value.data.results,
              response[3].value.data.roles
            )
          );
          setTeachers(
            response[3].value.data.teacher_command.map((teacher) => {
              return {
                id: teacher.teacher.user.id,
                name: teacher.teacher.user.last_name,
              };
            })
          );
        }
      });
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      if (!intensiveName && !intensiveDescription && !dateEnd && !dateStart)
        throw new Error(
          'Необходимо заполнить поля: intensiveName, intensiveDescription, dateEnd, dateStart'
        );
      const ids_studentRoles = studentRoles?.map((item) => item.id);
      const ids_flows = flows?.map((item) => item.id);
      const ids_teachers = teachers?.map((item) => item.id);
      const response = hasIntensive
        ? await PostService.patchIntensives(
            intensiveName,
            intensiveDescription,
            convertDateFormat(dateStart),
            convertDateFormat(dateEnd),
            ids_flows,
            ids_teachers,
            ids_studentRoles
          )
        : await PostService.postIntensives(
            intensiveName,
            intensiveDescription,
            convertDateFormat(dateStart),
            convertDateFormat(dateEnd),
            ids_flows,
            ids_teachers,
            ids_studentRoles
          );

      if (response) {
        localStorage.setItem('id', response.data.id);
        window.location.href = '/intensiv';
      } else {
      }
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  return (
    <div className="body">
      <SideMenu />
      <div className="main-block">
        <div className="center-block">
          <ChooseModal
            items={itemsWindow}
            itemsForResults={
              windowTeachers
                ? teachers
                : windowFlows
                ? flows
                : windowStudRoles
                ? studentRoles
                : null
            }
            isOpen={isOpen}
            onClose={
              windowTeachers
                ? setWindowTeachers
                : windowFlows
                ? setWindowFlows
                : windowStudRoles
                ? setWindowStudRoles
                : null
            }
            onSave={
              windowTeachers
                ? setTeachers
                : windowFlows
                ? setFlows
                : windowStudRoles
                ? setStudentRoles
                : null
            }
          />
          <div className="list-content column-container">
            <div className="title">
              <div className="font-32">
                {hasIntensive ? 'Редактировать интенсив' : 'Создать интенсив'}
              </div>
            </div>
            <div className="column-container">
              <div className="element-list-input">
                <div className="font-18 bold-font">Интенсив</div>
              </div>
              <form>
                <InputDescription
                  valueProp={intensiveName}
                  onChange={setIntensiveName}
                  descriptionProp={'Название интенсива'}
                />
                <InputDescription
                  valueProp={intensiveDescription}
                  onChange={setIntensiveDescription}
                  descriptionProp={'Описание интенсива'}
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

                <div className="element-list-input">
                  <div className="font-18 bold-font"> Участники</div>
                </div>

                <div className="element-list-input column-container">
                  <div className="">Список преподаватель</div>
                  <button
                    className="button-classic button-classic-dop"
                    type="button"
                    onClick={() => setWindowTeachers(true)}
                  >
                    {' '}
                    Выбрать{' '}
                  </button>
                  <div className="flex flex-wrap">
                    {teachers.length > 0 ? (
                      teachers.map((item) => (
                        <div className="ml-4 text-sm selectedInList">
                          {item.name}
                        </div>
                      ))
                    ) : (
                      <span className="text-[#6B7280]">
                        Выберите преподавателей
                      </span>
                    )}
                  </div>
                </div>

                <div className="element-list-input column-container">
                  <div className="">Список учебных групп</div>
                  <button
                    className="button-classic button-classic-dop"
                    type="button"
                    onClick={() => setWindowFlows(true)}
                  >
                    {' '}
                    Выбрать{' '}
                  </button>
                  <div className="flex flex-wrap">
                    {flows.length > 0 ? (
                      flows.map((item) => (
                        <div className="ml-4 text-sm selectedInList">
                          {item.name}
                        </div>
                      ))
                    ) : (
                      <span className="text-[#6B7280]">Выберите потоки</span>
                    )}
                  </div>
                </div>
                <div className="element-list-input column-container">
                  <div className="">Список ролей для студентов</div>
                  <button
                    className="button-classic button-classic-dop"
                    type="button"
                    onClick={() => setWindowStudRoles(true)}
                  >
                    {' '}
                    Выбрать{' '}
                  </button>
                  <div className="flex flex-wrap">
                    {flows.length > 0 ? (
                      studentRoles.map((item) => (
                        <div className="ml-4 text-sm selectedInList">
                          {item.name}
                        </div>
                      ))
                    ) : (
                      <span className="text-[#6B7280]">Выберите роли</span>
                    )}
                  </div>
                </div>

                <div className="element-list-input">
                  <div className="font-18 bold-font">Файлы для студентов</div>
                </div>

                <div>
                  <div className="border-2 border-dashed border-[#9CA3AF] rounded-md p-4 text-[#6B7280] file-block">
                    <label
                      htmlFor="fileUpload"
                      className="block mb-1 text-sm font-medium cursor-pointer"
                    >
                      Перетащите необходимые файлы
                    </label>
                    <input
                      id="fileUpload"
                      name="fileUpload"
                      type="file"
                      className="block text-sm text-[#6B7280] file:mr-4 file:py-2 file:px-4 file:rounded-md
                               file:border-0 file:text-sm file:font-semibold file:bg-[#E0E7FF] file:text-[#1D4ED8] cursor-pointer"
                      multiple
                    />
                  </div>
                </div>
                <div className="element-list-input">
                  <Link
                    className="button-classic margin element-list-input"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    {hasIntensive
                      ? 'Редактировать интенсив'
                      : 'Создать интенсив'}
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

export default ListCreateIntensiv;
