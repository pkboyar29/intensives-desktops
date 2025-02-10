import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';

import InputDescription from '../components/common/inputs/InputDescription';
import PrimaryButton from '../components/common/PrimaryButton';

import { ISignIn, UserRole } from '../ts/interfaces/IUser';

import { useSignInMutation, useLazyGetUserQuery } from '../redux/api/userApi';
import { useAppSelector } from '../redux/store';
import { setCurrentRole } from '../redux/slices/userSlice';

const SignInPage: FC = () => {
  const [signIn] = useSignInMutation();
  const [getUserInfo] = useLazyGetUserQuery();
  const currentUser = useAppSelector((state) => state.user.data);

  const [rolesToChoose, setRolesToChoose] = useState<UserRole[]>([]);
  const [chosenRole, setChosenRole] = useState<UserRole | null>(null);
  const [roleError, setRoleError] = useState<boolean>(false);

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
      if (currentUser.roles.includes('Студент')) {
        setRolesToChoose([...currentUser.roles, 'Наставник']);
      } else {
        setRolesToChoose(currentUser.roles);
      }
    }
  }, [currentUser]);

  const onSubmit = async (data: ISignIn) => {
    const { data: responseData, error: responseError } = await signIn(data);

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

  const onRoleClick = (role: UserRole) => {
    setChosenRole(role);
    setRoleError(false);
  };

  const onContinueButtonClick = () => {
    if (chosenRole === null) {
      setRoleError(true);
      return;
    }

    setCurrentRole(chosenRole);
    localStorage.setItem('currentRole', chosenRole);

    if (chosenRole === 'Администратор') {
      navigate('/admin');
    } else {
      navigate('/intensives');
    }
  };

  return (
    <>
      <div className="flex justify-center mt-20">
        <div className="flex flex-col gap-6 w-[480px]">
          {rolesToChoose.length > 0 ? (
            <>
              <div className="mx-auto text-[28px] font-bold">
                Выбор роли пользователя
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                {rolesToChoose.map((roleToChoose, index) => (
                  <div
                    className={`select-none flex items-center justify-center text-lg transition duration-300 ease-in-out rounded-lg cursor-pointer w-36 h-36 hover:text-white bg-another_white hover:bg-blue ${
                      roleToChoose === chosenRole &&
                      `border-solid border-2 border-blue`
                    }`}
                    key={index}
                    onClick={() => onRoleClick(roleToChoose)}
                  >
                    {roleToChoose}
                  </div>
                ))}
              </div>

              {roleError && (
                <div className="mx-auto text-base text-red">
                  Необходимо выбрать роль
                </div>
              )}

              <PrimaryButton
                children="Продолжить"
                onClick={onContinueButtonClick}
              />
            </>
          ) : (
            <>
              <div className="mx-auto text-[28px] font-bold">Авторизация</div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
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
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SignInPage;
