import { FC, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Cookies from 'js-cookie';

import { CurrentUserContext } from '../context/CurrentUserContext';
import { TeamsContext } from '../context/TeamsContext';
import { IUser } from '../ts/interfaces/IUser';
import { ITeam } from '../ts/interfaces/ITeam';

interface SignInProps {
  email: string;
  password: string;
}

const SignInPage: FC = () => {
  const { currentUser, updateCurrentUser } = useContext(CurrentUserContext);
  const { getCurrentTeamForStudent } = useContext(TeamsContext);
  const navigate = useNavigate();

  const { handleSubmit, register } = useForm<SignInProps>({
    mode: 'onBlur',
  });

  useEffect(() => {
    if (currentUser) {
      redirect(currentUser);
    }
  }, [currentUser]);

  const onSubmit = async (data: SignInProps) => {
    console.log(data);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/token/`,
        data
      );
      console.log(response.data);
      Cookies.set('refresh', response.data.refresh);
      Cookies.set('access', response.data.access);

      const currentUserInfo: IUser = await updateCurrentUser();
      redirect(currentUserInfo);
    } catch (error) {
      console.log(error);
    }
  };

  const redirect = async (currentUser: IUser) => {
    if (currentUser.user_role_id === 1) {
      if (currentUser.student_id) {
        const currentTeam: Promise<ITeam> = getCurrentTeamForStudent(
          currentUser.student_id
        );
        const currentTeamId = (await currentTeam).id;
        navigate(`/student/${currentTeamId}/overview`);
      }
    } else {
      // if user_role_id == 2 or 3 or 4
      navigate('/intensives');
    }
  };

  return (
    <>
      <div className="flex justify-center mt-20">
        <div className="flex flex-col">
          <div className="py-3 text-[28px] font-bold">Авторизация</div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 w-[480px]"
          >
            <input
              {...register('email')}
              className="p-4 font-sans text-base border border-black border-solid rounded-lg"
              type="text"
              placeholder="Email"
            />
            <input
              {...register('password')}
              className="p-4 font-sans text-base border border-black border-solid rounded-lg"
              type="password"
              placeholder="Пароль"
            />
            <button
              className="p-4 font-sans text-left text-white rounded-lg bg-blue"
              type="submit"
            >
              ВОЙТИ
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignInPage;
