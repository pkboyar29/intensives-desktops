import { FC, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import InputDescription from '../components/common/inputs/InputDescription';
import PrimaryButton from '../components/common/PrimaryButton';
import ChoosingRoleComponent from '../components/ChoosingRoleComponent';

import { ISignIn, IUser, UserRole } from '../ts/interfaces/IUser';

import { useSignInMutation, useLazyGetUserQuery } from '../redux/api/userApi';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { setCurrentUser } from '../redux/slices/userSlice';
import { redirectByRole } from '../helpers/urlHelpers';

const SignInPage: FC = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.data);

  const [signIn] = useSignInMutation();
  const [getUserInfo] = useLazyGetUserQuery();

  const [tempUser, setTempUser] = useState<IUser | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm<ISignIn>({
    mode: 'onBlur',
  });

  useEffect(() => {
    if (currentUser && currentUser.currentRole) {
      redirectByRole(currentUser.currentRole);
    }
  }, [currentUser]);

  const handleResponseError = (error: FetchBaseQueryError) => {
    const errorData = (error as FetchBaseQueryError).data as {
      email?: string;
      password?: string;
    };

    if (errorData && errorData.email) {
      setError('email', {
        type: 'custom',
        message: errorData.email,
      });
    } else if (errorData && errorData.password) {
      setError('password', {
        type: 'custom',
        message: errorData.password,
      });
    }
  };

  const onSubmit = async (data: ISignIn) => {
    const { data: responseData, error: responseError } = await signIn(data);

    if (responseError) {
      handleResponseError(responseError as FetchBaseQueryError);
    }

    if (responseData) {
      Cookies.set('access', responseData.access, {
        expires: 1,
      });
      Cookies.set('refresh', responseData.refresh, {
        expires: 15,
      });

      const { data: userData } = await getUserInfo();
      if (userData) {
        let updatedRoles: UserRole[] = userData.roles;
        let isUserOnlyStudent: boolean = false;

        if (userData.roles.some((role) => role.name === 'Student')) {
          updatedRoles = [
            ...userData.roles,
            { name: 'Mentor', displayName: 'Наставник' },
          ];
          isUserOnlyStudent = true;
        }

        if (
          updatedRoles.length === 1 ||
          (updatedRoles.length === 2 && isUserOnlyStudent)
        ) {
          setUserWithCurrentRole(
            { ...userData, roles: updatedRoles },
            userData.roles[0]
          );
        } else {
          setTempUser({
            ...userData,
            roles: updatedRoles,
          });
        }
      }
    }
  };

  const onContinueButtonClick = (role: UserRole) => {
    if (tempUser) {
      setUserWithCurrentRole(tempUser, role);
    }
  };

  const setUserWithCurrentRole = (tempUser: IUser, currentRole: UserRole) => {
    dispatch(
      setCurrentUser({
        ...tempUser,
        currentRole: currentRole,
      })
    );
    localStorage.setItem('currentRole', currentRole.name);
  };

  return (
    <div className="pt-[88px] w-full px-3 md:flex md:justify-center">
      <div className="md:w-[480px]">
        {tempUser ? (
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="text-center text-[28px] font-bold">
              Выбор роли пользователя
            </div>

            <ChoosingRoleComponent
              rolesToChoose={tempUser.roles}
              onContinueButtonClick={onContinueButtonClick}
            />
          </motion.div>
        ) : (
          <div className="flex flex-col gap-6">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default SignInPage;
