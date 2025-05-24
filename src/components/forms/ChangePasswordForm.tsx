import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useChangePasswordMutation } from '../../redux/api/userApi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import PrimaryButton from '../common/PrimaryButton';
import InputDescription from '../common/inputs/InputDescription';

interface ChangePasswordFields {
  oldPassword: string;
  newPassword: string;
  newPasswordAgain: string;
}

interface ChangePasswordFormProps {
  onChangePassword: () => void;
  onError: () => void;
}

const ChangePasswordForm: FC<ChangePasswordFormProps> = ({
  onChangePassword,
  onError,
}) => {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

  const [changePassword] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<ChangePasswordFields>({
    mode: 'onBlur',
  });

  const onSubmit = async (data: ChangePasswordFields) => {
    const { data: responseData, error: responseError } = await changePassword({
      oldPassword: data.oldPassword,
      password: data.newPassword,
    });

    if (responseData) {
      onChangePassword();
    }

    if (responseError) {
      const errorData = (responseError as FetchBaseQueryError).data as {
        old_password: string[];
      };
      if (errorData.old_password) {
        setError('oldPassword', {
          type: 'custom',
          message: errorData.old_password[0],
        });
      } else {
        onError();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <div className="text-base">
        Пароль должен содержать хотя бы одну цифру, одну заглавную и строчную
        букву, а также один спецсимвол (!@#$%^&*). Пароль должен содержать от 5
        до 20 символов
      </div>

      <InputDescription
        register={register}
        registerOptions={{
          required: 'Поле обязательно для заполнения',
        }}
        fieldName="oldPassword"
        placeholder="Введите старый пароль"
        description="Старый пароль"
        type="password"
        errorMessage={
          typeof errors.oldPassword?.message === 'string'
            ? errors.oldPassword.message
            : ''
        }
      />

      <InputDescription
        register={register}
        registerOptions={{
          required: 'Поле обязательно для заполнения',
          minLength: {
            value: 5,
            message: 'Минимальное количество символов - 5',
          },
          maxLength: {
            value: 20,
            message: 'Максимальное количество символов - 20',
          },
          pattern: {
            value: passwordRegex,
            message:
              'Пароль должен содержать хотя бы одну цифру, одну заглавную и строчную букву, а также один спецсимвол (!@#$%^&*)',
          },
        }}
        fieldName="newPassword"
        placeholder="Введите новый пароль"
        description="Новый пароль"
        type="password"
        errorMessage={
          typeof errors.newPassword?.message === 'string'
            ? errors.newPassword.message
            : ''
        }
      />

      <InputDescription
        register={register}
        registerOptions={{
          required: 'Поле обязательно для заполнения',
          validate: {
            equalToOriginal: (value: string, formValues) =>
              value === formValues.newPassword || 'Пароли должны совпадать',
          },
        }}
        fieldName="newPasswordAgain"
        placeholder="Введите новый пароль еще раз"
        description="Введите новый пароль еще раз"
        type="password"
        errorMessage={
          typeof errors.newPasswordAgain?.message === 'string'
            ? errors.newPasswordAgain.message
            : ''
        }
      />

      <div className="mt-3 ml-auto w-fit">
        <PrimaryButton type="submit" children="Сохранить новый пароль" />
      </div>
    </form>
  );
};

export default ChangePasswordForm;
