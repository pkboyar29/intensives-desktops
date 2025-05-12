import { ColumnOrderColumn } from '@tanstack/react-table';
import { IAudience } from '../ts/interfaces/IAudience';
import { IBuilding } from '../ts/interfaces/IBuilding';
import {
  IProfile,
  ISpecialization,
  IStageEducation,
} from '../ts/interfaces/IEducation';
import { IFlow } from '../ts/interfaces/IFlow';
import { IGroup } from '../ts/interfaces/IGroup';
import { IStudentAdmin } from '../ts/interfaces/IStudent';
import { IUniversity } from '../ts/interfaces/IUniversity';
import { ITeacherAdmin } from '../ts/interfaces/ITeacher';
import { IMarkStrategy } from '../ts/interfaces/IMarkStrategy';
import { IStudentRole } from '../ts/interfaces/IStudentRole';
import { ICriteria } from '../ts/interfaces/ICriteria';

/*
type DotNotationKeys<T, Prefix extends string = ''> = {
  [K in keyof T]: T[K] extends object
    ? T[K] extends Array<any>
      ? `${Prefix}${Extract<K, string>}`
      :
          | `${Prefix}${Extract<K, string>}`
          | DotNotationKeys<T[K], `${Prefix}${Extract<K, string>}.`>
    : `${Prefix}${Extract<K, string>}`;
}[keyof T];
*/

// Тип для метаданных интерфейсов для таблицы
export type ColumnConfig<T> = {
  key: keyof T;
  adaptedKeyName?: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'relation';
  renderKey?: string; // не string и не keyof T а keyof T и от типов поля с внешним ключом
  parentField?: keyof T;
  readOnly?: boolean;
  isNull?: boolean;
};

// Набор метаданных (можно вроде автоматически вычислять)

export const universityColumns: ColumnConfig<IUniversity>[] = [
  { key: 'id', label: 'ID', type: 'number', readOnly: true },
  { key: 'name', label: 'Название', type: 'string' },
];

export const buildingColumns: ColumnConfig<IBuilding>[] = [
  { key: 'id', label: 'ID', type: 'number', readOnly: true },
  { key: 'name', label: 'Название', type: 'string' },
  {
    key: 'university',
    label: 'Университет',
    type: 'relation',
    renderKey: 'name',
  },
  { key: 'address', label: 'Адрес', type: 'string' },
];

export const audienceColumns: ColumnConfig<IAudience>[] = [
  { key: 'id', label: 'ID', type: 'number', readOnly: true },
  { key: 'name', label: 'Название', type: 'string' },
  {
    key: 'building',
    label: 'Корпус',
    type: 'relation',
    renderKey: 'name',
  },
];

export const flowsColumns: ColumnConfig<IFlow>[] = [
  { key: 'id', label: 'ID', type: 'number', readOnly: true },
  { key: 'name', label: 'Название', type: 'string' },
  {
    key: 'university',
    label: 'Университет',
    type: 'relation',
    renderKey: 'name',
  },
  {
    key: 'stageEducation',
    adaptedKeyName: 'stage_education',
    label: 'Ступень',
    type: 'relation',
    renderKey: 'name',
  },
  { key: 'graduationDate', label: 'Дата выпуска', type: 'date', isNull: true },
];

export const groupsColumns: ColumnConfig<IGroup>[] = [
  { key: 'id', label: 'ID', type: 'number', readOnly: true },
  { key: 'name', label: 'Название', type: 'string' },
  {
    key: 'flow',
    label: 'Поток',
    type: 'relation',
    renderKey: 'name',
  },
  {
    key: 'profile',
    label: 'Профиль',
    type: 'relation',
    renderKey: 'name',
    parentField: 'specialization',
    isNull: true,
  },
  {
    key: 'specialization',
    label: 'Направление',
    type: 'relation',
    renderKey: 'name',
  },
];

export const stagesEducationColumns: ColumnConfig<IStageEducation>[] = [
  { key: 'id', label: 'ID', type: 'number', readOnly: true },
  { key: 'name', label: 'Название', type: 'string' },
];

export const profilesColumns: ColumnConfig<IProfile>[] = [
  { key: 'id', label: 'ID', type: 'number', readOnly: true },
  { key: 'name', label: 'Название', type: 'string' },
  {
    key: 'specialization',
    label: 'Направление образования',
    type: 'relation',
    renderKey: 'name',
  },
];

export const specializationsColumns: ColumnConfig<ISpecialization>[] = [
  { key: 'id', label: 'ID', type: 'number', readOnly: true },
  { key: 'name', label: 'Название', type: 'string' },
  { key: 'code', label: 'Код', type: 'string' },
];

export const studentsColumns: ColumnConfig<IStudentAdmin>[] = [
  { key: 'id', label: 'ID', type: 'number', readOnly: true },
  { key: 'firstName', label: 'Имя', type: 'string' },
  { key: 'lastName', label: 'Фамилия', type: 'string' },
  { key: 'patronymic', label: 'Отчество', type: 'string' },
  { key: 'email', label: 'Почта', type: 'string' },
  { key: 'resetPassword', label: 'Пароль', type: 'boolean', isNull: true },
  { key: 'group', label: 'Группа', type: 'relation', renderKey: 'name' },
];

export const teachersColumns: ColumnConfig<ITeacherAdmin>[] = [
  { key: 'id', label: 'ID', type: 'number', readOnly: true },
  { key: 'firstName', label: 'Имя', type: 'string' },
  { key: 'lastName', label: 'Фамилия', type: 'string' },
  { key: 'patronymic', label: 'Отчество', type: 'string' },
  { key: 'email', label: 'Почта', type: 'string' },
  { key: 'resetPassword', label: 'Пароль', type: 'boolean', isNull: true },
  {
    key: 'university',
    label: 'Университет',
    type: 'relation',
    renderKey: 'name',
  },
  { key: 'isManager', label: 'Организатор', type: 'boolean', isNull: true },
];

export const markStrategiesColumns: ColumnConfig<IMarkStrategy>[] = [
  { key: 'id', label: 'ID', type: 'number', readOnly: true },
  { key: 'name', label: 'Название', type: 'string' },
  { key: 'lowBound', label: 'Нижняя граница', type: 'number' },
  { key: 'highBound', label: 'Верхняя граница', type: 'number' },
];

export const studentRolesColumns: ColumnConfig<IStudentRole>[] = [
  { key: 'id', label: 'ID', type: 'number', readOnly: true },
  { key: 'name', label: 'Название', type: 'string' },
];

export const criteriasColumns: ColumnConfig<ICriteria>[] = [
  { key: 'id', label: 'ID', type: 'number', readOnly: true },
  { key: 'name', label: 'Название', type: 'string' },
];
