import { FC, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';

import InputDescription from '../components/common/inputs/InputDescription';
import PrimaryButton from '../components/common/PrimaryButton';
import ChoosingRoleComponent from '../components/ChoosingRoleComponent';

import { ISignIn, IUser, UserRole } from '../ts/interfaces/IUser';

import { useSignInMutation, useLazyGetUserQuery } from '../redux/api/userApi';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { setCurrentUser } from '../redux/slices/userSlice';
import { redirectByRole } from '../helpers/urlHelpers';
import { isUserStudent } from '../helpers/userHelpers';

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

  const onSubmit = async (data: ISignIn) => {
    const { data: responseData, error: responseError } = await signIn(data);

    if (responseData) {
      Cookies.set('access', responseData.access, {
        expires: 1,
      });
      Cookies.set('refresh', responseData.refresh, {
        expires: 15,
      });

      const { data: userData } = await getUserInfo();
      if (userData) {
        const updatedRoles: UserRole[] = isUserStudent(userData)
          ? [...userData.roles, { name: 'Mentor', displayName: 'Наставник' }]
          : userData.roles;

        if (
          updatedRoles.length === 1 ||
          (updatedRoles.includes({ name: 'Student', displayName: 'Студент' }) &&
            updatedRoles.length === 2)
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

    if (responseError) {
      setError('password', {
        type: 'custom',
        message: 'Email или пароль неверны!',
      });
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
    <div className="w-full px-3 mt-20 md:flex md:justify-center">
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
