import { FC, useEffect, useState } from 'react';
import ChooseModal from '../ChooseModal';
import PostService from '../../API/PostService';
import { useParams, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { IntensivesContext } from '../../context/IntensivesContext';
import { useForm } from 'react-hook-form';

import Title from '../Title/Title';

interface ManageIntensiveFields {
  name: string;
  description: string;
  open_dt: string;
  close_dt: string;
}

const ManageIntensiveForm: FC = () => {
  const { intensiveId } = useParams();
  const navigate = useNavigate();

  const { getIntensiveById } = useContext(IntensivesContext);

  const [flows, setFlows] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [studentRoles, setStudentRoles] = useState<any[]>([]);

  // modals
  const [modalStudRoles, setModalStudRoles] = useState<boolean>(false);
  const [modalTeachers, setModalTeachers] = useState<boolean>(false);
  const [modalFlows, setModalFlows] = useState<boolean>(false);

  const { register, handleSubmit, setValue } = useForm<ManageIntensiveFields>({
    mode: 'onBlur',
  });

  useEffect(() => {
    const setInitialData = async () => {
      if (intensiveId) {
        const currentIntensive = await getIntensiveById(parseInt(intensiveId));

        setValue('name', currentIntensive.name);
        setValue('description', currentIntensive.description);
        setValue(
          'open_dt',
          currentIntensive.open_dt.toISOString().split('T')[0]
        );
        setValue(
          'close_dt',
          currentIntensive.close_dt.toISOString().split('T')[0]
        );
      }
    };
    setInitialData();
  }, [intensiveId]);

  const onSubmit = async (data: ManageIntensiveFields) => {
    try {
      console.log(data);
      if (intensiveId) {
        await PostService.updateIntensive(
          intensiveId,
          data.name,
          data.description,
          new Date(data.open_dt),
          new Date(data.close_dt)
        );
        navigate(`/manager/${intensiveId}/overview`);
      } else {
        const { data: responseData } = await PostService.createIntensive(
          data.name,
          data.description,
          new Date(data.open_dt),
          new Date(data.close_dt)
        );
        navigate(`/manager/${responseData.id}/overview`);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex justify-center min-h-screen min-w-[50vw] max-w-[1280px]">
      {modalFlows && (
        <ChooseModal
          itemsProp={[]}
          itemsForResults={[]}
          onClose={() => setModalFlows(false)}
          onSave={() => {}}
        />
      )}

      {modalTeachers && (
        <ChooseModal
          itemsProp={[]}
          itemsForResults={[]}
          onClose={() => setModalTeachers(false)}
          onSave={() => {}}
        />
      )}

      {modalStudRoles && (
        <ChooseModal
          itemsProp={[]}
          itemsForResults={[]}
          onClose={() => setModalStudRoles(false)}
          onSave={() => {}}
        />
      )}

      <form className="list-content" onSubmit={handleSubmit(onSubmit)}>
        <Title
          text={intensiveId ? 'Редактировать интенсив' : 'Создать интенсив'}
        />

        <div className="py-3 text-lg font-bold">Интенсив</div>

        <div className="flex flex-col w-full gap-2 my-3 text-lg">
          <div>Название интенсива</div>
          <input
            {...register('name')}
            type="text"
            className="p-2.5 rounded-[10px] bg-[#f0f2f5]"
            placeholder="Название интенсива"
          />
        </div>

        <div className="flex flex-col w-full gap-2 my-3 text-lg">
          <div>Описание интенсива</div>
          <input
            {...register('description')}
            type="text"
            className="p-2.5 rounded-[10px] bg-[#f0f2f5]"
            placeholder="Описание интенсива"
          />
        </div>

        <div className="py-3 text-lg font-bold">Время проведения</div>

        <div className="flex justify-between gap-2.5">
          <div className="flex flex-col w-full gap-2 my-3 text-lg">
            <div>Дата начала</div>
            <input
              {...register('open_dt')}
              type="date"
              className="p-2.5 rounded-[10px] bg-[#f0f2f5]"
            />
          </div>

          <div className="flex flex-col w-full gap-2 my-3 text-lg">
            <div>Дата окончания</div>
            <input
              {...register('close_dt')}
              type="date"
              className="p-2.5 rounded-[10px] bg-[#f0f2f5]"
            />
          </div>
        </div>

        <div className="py-3 text-lg font-bold">Участники</div>

        <div className="flex flex-col gap-2 my-3 text-lg">
          <div>Список учебных групп</div>
          <button
            className="bg-[#1a5ce5] text-white px-4 py-1.5 rounded-[10px] w-max my-2.5"
            type="button"
            onClick={() => setModalFlows(true)}
          >
            {' '}
            Выбрать{' '}
          </button>
          <div className="flex flex-wrap">
            {flows.length > 0 ? (
              flows.map((item: any) => (
                <div className="ml-4 text-sm selectedInList">{item.name}</div>
              ))
            ) : (
              <span className="text-[#6B7280]">Выберите потоки</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 my-3 text-lg">
          <div>Список ролей для студентов</div>
          <button
            className="bg-[#1a5ce5] text-white px-4 py-1.5 rounded-[10px] w-max my-2.5"
            type="button"
            onClick={() => setModalStudRoles(true)}
          >
            {' '}
            Выбрать{' '}
          </button>
          <div className="flex flex-wrap">
            {flows.length > 0 ? (
              studentRoles.map((item: any) => (
                <div className="ml-4 text-sm selectedInList">{item.name}</div>
              ))
            ) : (
              <span className="text-[#6B7280]">Выберите роли</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 my-3 text-lg">
          <div>Список преподавателей</div>
          <button
            className="bg-[#1a5ce5] text-white px-4 py-1.5 rounded-[10px] w-max my-2.5"
            type="button"
            onClick={() => setModalTeachers(true)}
          >
            {' '}
            Выбрать{' '}
          </button>
          <div className="flex flex-wrap">
            {teachers.length > 0 ? (
              teachers.map((item: any) => (
                <div className="ml-4 text-sm selectedInList">{item.name}</div>
              ))
            ) : (
              <span className="text-[#6B7280]">Выберите преподавателей</span>
            )}
          </div>
        </div>

        <div className="py-3 text-lg font-bold">Файлы для студентов</div>

        <div className="border-2 border-dashed border-[#9CA3AF] rounded-md p-4 text-[#6B7280] flex flex-col items-center justify-center h-[20vh]">
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

        <div className="my-5">
          <button
            className="bg-[#1a5ce5] text-white px-4 py-2.5 rounded-[10px] w-full flex justify-center text-lg font-bold"
            type="submit"
          >
            {intensiveId ? 'Редактировать интенсив' : 'Создать интенсив'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageIntensiveForm;
