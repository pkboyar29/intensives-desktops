import { FC, useEffect, useState } from 'react';
import PostService from '../API/PostService';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import Title from '../components/Title/Title';
import Tag from '../components/Tag';

const ManageRolesPage: FC = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [currentRole, setCurrentRole] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await PostService.getStudenRoles();
        setRoles(data.results);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);

  const addRole = async () => {
    try {
      const { data } = await PostService.postStudentsRole(currentRole);
      setRoles([...roles, data]);
      setCurrentRole('');
    } catch (e) {
      console.log(e);
    }
  };

  const deleteRole = async (id: number) => {
    try {
      await PostService.deleteStudentsRole(id);
      setRoles(roles.filter((elem) => elem.id !== id));
    } catch (e) {
      console.log(e);
    }
    setCurrentRole('');
  };

  const addRoleButtonClickHandler = () => {
    addRole();
  };

  const roleInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentRole(e.target.value);
  };

  const roleTagCloseHandler = (id: number) => {
    deleteRole(id);
  };

  return (
    <div className="flex justify-center min-h-screen min-w-[50vw] max-w-[1280px]">
      <div className="list-content">
        <Title text="Роли студентов" />

        <div className="flex flex-col gap-6 mt-6">
          <div className="text-xl font-bold">Все роли</div>
          <div className="flex flex-wrap gap-[5px]">
            {roles.length > 0 ? (
              roles
                .filter((res) => res.for_student)
                .map((elem) => (
                  <Tag
                    key={elem.id}
                    name={elem.name}
                    deleteHandler={() => roleTagCloseHandler(elem.id)}
                  />
                ))
            ) : (
              <Skeleton />
            )}
          </div>

          <div className="text-xl font-bold">Добавить роль</div>
          <div className="flex flex-col gap-2">
            <div className="text-lg">Название роли</div>
            <input
              type="text"
              value={currentRole}
              className="p-2.5 rounded-[10px] bg-[#f0f2f5] text-lg"
              onChange={roleInputChangeHandler}
              placeholder="Введите название роли"
            />
          </div>

          <button
            className="bg-[#1a5ce5] text-white px-4 py-2.5 rounded-[10px] w-full flex justify-center"
            onClick={addRoleButtonClickHandler}
          >
            {' '}
            Добавить роль
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageRolesPage;
