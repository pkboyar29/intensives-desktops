import { createContext, FC, ReactNode, useState } from 'react';
import { IUser } from '../ts/interfaces/IUser';
import axios from 'axios';
import Cookies from 'js-cookie';
import authHeader from '../helpers/getHeaders';

interface CurrentUserContextType {
  currentUser: IUser | null;
  updateCurrentUser: () => Promise<IUser>;
  logOut: () => void;
}

export const CurrentUserContext = createContext<CurrentUserContextType>({
  currentUser: null,
  updateCurrentUser: () =>
    Promise.resolve({
      id: 0,
      teacher_id: null,
      student_id: null,
      firstName: '',
      lastName: '',
      middleName: '',
      email: '',
      roleId: 0,
    }),
  logOut: () => {},
});

interface CurrentUserProviderProps {
  children: ReactNode;
}

const CurrentUserProvider: FC<CurrentUserProviderProps> = ({ children }) => {
  const [currentUserInfo, setCurrentUserInfo] = useState<IUser | null>(null);

  const updateCurrentUserInfo = async (): Promise<IUser> => {
    try {
      const userResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/users/me/`,
        { headers: await authHeader() }
      );

      let student_id = null;
      if (userResponse.data.role.id === 1) {
        const studentResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/students/`,
          { headers: await authHeader() }
        );
        const allStudents = studentResponse.data.results;
        const ourStudent = allStudents.find(
          (student: any) => student.user.id === userResponse.data.id
        );
        student_id = ourStudent.id;
      }

      let teacher_id = null;
      if (userResponse.data.role.id === 3) {
        const teachersResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/teachers/`,
          { headers: await authHeader() }
        );
        const allTeachers = teachersResponse.data.results;
        const ourTeacher = allTeachers.find(
          (teacher: any) => teacher.user.id === userResponse.data.id
        );
        teacher_id = ourTeacher.id;
      }

      const user: IUser = {
        id: userResponse.data.id,
        teacher_id: teacher_id,
        student_id: student_id,
        firstName: userResponse.data.first_name,
        lastName: userResponse.data.last_name,
        middleName: userResponse.data.middle_name,
        email: userResponse.data.email,
        roleId: userResponse.data.role.id,
      };
      setCurrentUserInfo(user);

      return user;
    } catch (e) {
      console.log('Error while updating current user info ', e);
      return {
        id: 0,
        teacher_id: null,
        student_id: null,
        firstName: '',
        lastName: '',
        middleName: '',
        email: '',
        roleId: 0,
      };
    }
  };

  const logOut = (): void => {
    setCurrentUserInfo(null);
    Cookies.remove('access');
    Cookies.remove('refresh');
  };

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser: currentUserInfo,
        updateCurrentUser: updateCurrentUserInfo,
        logOut,
      }}
    >
      {' '}
      {children}{' '}
    </CurrentUserContext.Provider>
  );
};

export default CurrentUserProvider;
