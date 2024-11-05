import { FC, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import {
  useGetStudentRolesQuery,
  useCreateStudentRoleMutation,
  useDeleteStudentRoleMutation,
} from '../redux/api/studentRoleApi';

import { IStudentRole } from '../ts/interfaces/IStudentRole';

import Title from '../components/Title';
import PrimaryButton from '../components/PrimaryButton';
import Tag from '../components/Tag';

const ManageRolesPage: FC = () => {
  const [studentRoles, setStudentRoles] = useState<IStudentRole[]>([]);
  const [inputString, setInputString] = useState<string>('');

  const {
    data: studentRolesResponseData,
    isSuccess: isSuccessGetStudentRoles,
  } = useGetStudentRolesQuery();
  const [createStudentRole] = useCreateStudentRoleMutation();
  const [deleteStudentRole] = useDeleteStudentRoleMutation();

  useEffect(() => {
    if (isSuccessGetStudentRoles) {
      setStudentRoles(studentRolesResponseData);
    }
  }, [isSuccessGetStudentRoles]);

  const addRole = async () => {
    if (inputString.length !== 0) {
      try {
        const response = await createStudentRole({ name: inputString });

        if (response.data) {
          setStudentRoles([...studentRoles, response.data]);
          setInputString('');
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const deleteRole = async (id: number) => {
    try {
      await deleteStudentRole(id);
      setStudentRoles(
        studentRoles.filter((studentRole) => studentRole.id !== id)
      );
      setInputString('');
    } catch (e) {
      console.log(e);
    }
  };

  const addRoleButtonClickHandler = () => {
    addRole();
  };

  const roleInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputString(e.target.value);
  };

  const roleTagCloseHandler = (id: number) => {
    deleteRole(id);
  };

  return (
    <div className="flex justify-center max-w-[1280px]">
      <div className="max-w-[765px] w-full">
        <Title text="Роли студентов" />

        <div className="flex flex-col gap-6 mt-6">
          <div className="text-xl font-bold">Все роли</div>
          <div className="flex flex-wrap gap-[5px]">
            {studentRoles.length > 0 ? (
              studentRoles
                .filter((res) => res.for_student)
                .map((elem) => (
                  <Tag
                    shouldHaveCrossIcon={true}
                    key={elem.id}
                    content={elem.name}
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
              value={inputString}
              className="p-2.5 rounded-[10px] bg-another_white text-lg"
              onChange={roleInputChangeHandler}
              placeholder="Введите название роли"
            />
          </div>

          <PrimaryButton
            text="Добавить роль"
            clickHandler={addRoleButtonClickHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageRolesPage;
