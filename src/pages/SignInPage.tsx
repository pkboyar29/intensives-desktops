import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';

import { ISignIn } from '../ts/interfaces/IUser';

import { useSignInMutation, useLazyGetUserQuery } from '../redux/api/userApi';
import { useAppSelector } from '../redux/store';

const SignInPage: FC = () => {
  const [signIn, { error: signInError }] = useSignInMutation();
  const [trigger] = useLazyGetUserQuery();
  const currentUser = useAppSelector((state) => state.user.data);

  const navigate = useNavigate();

  const { handleSubmit, register } = useForm<ISignIn>({
    mode: 'onBlur',
  });

  useEffect(() => {
    if (currentUser) {
      redirect(currentUser.roleId);
    }
  }, [currentUser]);

  useEffect(() => {
    if (signInError) {
      console.log(signInError);
    }
  }, [signInError]);

  const onSubmit = async (data: ISignIn) => {
    const signInDataResponse = await signIn(data).unwrap();

    Cookies.set('access', signInDataResponse.access);
    Cookies.set('refresh', signInDataResponse.refresh);

    trigger();
  };

  const redirect = (roleId: number) => {
    if (roleId === 1) {
      navigate('/intensives');
    } else {
      // if roleId == 2 or 3 or 4
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
