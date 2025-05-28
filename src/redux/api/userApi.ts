import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import {
  IChangePassword,
  ISignIn,
  ISignInResponse,
  IUser,
  IUserAdmin,
  UserRole,
  UserRoleMap,
} from '../../ts/interfaces/IUser';

export const mapRoleName = (roleName: string): UserRole => {
  const displayName = UserRoleMap[roleName as keyof typeof UserRoleMap];

  if (!displayName) {
    throw new Error(`Вернута неподходящая роль: ${roleName}`);
  }

  return {
    name: roleName as keyof typeof UserRoleMap,
    displayName,
  };
};

const mapUser = (unmappedUser: any): IUser => {
  return {
    id: unmappedUser.id,
    firstName: unmappedUser.first_name,
    lastName: unmappedUser.last_name,
    patronymic: unmappedUser.patronymic,
    email: unmappedUser.email,
    notificationDisabled: unmappedUser.notification_disabled,
    roles: unmappedUser.roles.map((role: any) => mapRoleName(role.name)),
    currentRole: null,
  };
};

export const mapUserAdmin = (unmappedUser: any): IUserAdmin => {
  return {
    id: unmappedUser.id,
    firstName: unmappedUser.first_name,
    lastName: unmappedUser.last_name,
    patronymic: unmappedUser.patronymic,
    email: unmappedUser.email,
    roles: unmappedUser.roles.map((role: any) => mapRoleName(role.name)),
  };
};

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    signIn: builder.mutation<ISignInResponse, ISignIn>({
      query: (credentials) => ({
        url: '/token/',
        method: 'POST',
        body: credentials,
      }),
    }),
    changePassword: builder.mutation<string, IChangePassword>({
      query: (data) => ({
        url: '/users/change_password/',
        method: 'PATCH',
        body: {
          old_password: data.oldPassword,
          password: data.password,
        },
      }),
    }),
    toggleNotifications: builder.mutation<string, boolean>({
      query: (notificationDisabled) => ({
        url: '/users/toggle_notifications/',
        method: 'PATCH',
        body: {
          notification_disabled: notificationDisabled,
        },
      }),
    }),
    getUser: builder.query<IUser, void>({
      query: () => '/users/me',
      transformResponse: (response: any): IUser => mapUser(response),
    }),
  }),
});

export const {
  useLazyGetUserQuery,
  useSignInMutation,
  useChangePasswordMutation,
  useToggleNotificationsMutation,
} = userApi;
