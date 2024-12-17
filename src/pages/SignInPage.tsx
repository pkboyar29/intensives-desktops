import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';

import InputDescription from '../components/common/inputs/InputDescription';
import PrimaryButton from '../components/common/PrimaryButton';

import { ISignIn } from '../ts/interfaces/IUser';

import { useSignInMutation, useLazyGetUserQuery } from '../redux/api/userApi';
import { useAppSelector } from '../redux/store';

const SignInPage: FC = () => {
  const [signIn] = useSignInMutation();
  const [getUserInfo] = useLazyGetUserQuery();
  const currentUser = useAppSelector((state) => state.user.data);

  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm<ISignIn>({
    mode: 'onBlur',
  });

  useEffect(() => {
    if (currentUser) {
      navigate('/intensives');
    }
  }, [currentUser]);

  const onSubmit = async (data: ISignIn) => {
      const {data: responseData, error: responseError } = await signIn(data);

      if (responseData) {
        Cookies.set('access', responseData.access, {
          expires: 1,
        });
        Cookies.set('refresh', responseData.refresh, {
          expires: 15,
        });
  
        getUserInfo();  
      }

      if (responseError) {
        setError('password', {
          type: 'custom',
          message: 'Email или пароль неверны!',
        });
      }
  };

  return (
    <>
      <div className="flex justify-center mt-20">
        <div className="flex flex-col">
          <div className="py-3 text-[28px] font-bold">Авторизация</div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 w-[480px] mt-3"
          >
            <InputDescription
              register={register}
              registerOptions={{
                required: 'Поле обязательно для заполнения',
              }}
              fieldName="email"
              placeholder="Введите email"
              description="Email"
              errorMessage={
                typeof errors.email?.message === 'string'
                  ? errors.email.message
                  : ''
              }
            />

            <InputDescription
              register={register}
              registerOptions={{
                required: 'Поле обязательно для заполнения',
              }}
              fieldName="password"
              placeholder="Введите пароль"
              description="Пароль"
              type="password"
              errorMessage={
                typeof errors.password?.message === 'string'
                  ? errors.password.message
                  : ''
              }
            />

            <PrimaryButton children="Войти в систему" type="submit" />
          </form>
        </div>
      </div>
    </>
  );
};

export default SignInPage;
