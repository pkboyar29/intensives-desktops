import { IAudience } from '../ts/interfaces/IAudience';
import { IBuilding } from '../ts/interfaces/IBuilding';
import { ICriteria } from '../ts/interfaces/ICriteria';
import {
  IProfile,
  ISpecialization,
  IStageEducation,
} from '../ts/interfaces/IEducation';
import { IFlow } from '../ts/interfaces/IFlow';
import { IGroup } from '../ts/interfaces/IGroup';
import { IMarkStrategy } from '../ts/interfaces/IMarkStrategy';
import { IStudentAdmin } from '../ts/interfaces/IStudent';
import { IStudentRole } from '../ts/interfaces/IStudentRole';
import { ITeacherAdmin } from '../ts/interfaces/ITeacher';
import { IUniversity } from '../ts/interfaces/IUniversity';
import {
  audienceColumns,
  buildingColumns,
  ColumnConfig,
  criteriasColumns,
  flowsColumns,
  groupsColumns,
  markStrategiesColumns,
  profilesColumns,
  specializationsColumns,
  stagesEducationColumns,
  studentRolesColumns,
  studentsColumns,
  teachersColumns,
  universityColumns,
} from './nameConfig';

export type TableType = keyof typeof tableConfigs; // тип на все ключи в tableConfigs

type TableConfigMap = {
  universities: ColumnConfig<IUniversity>[];
  buildings: ColumnConfig<IBuilding>[];
  audiences: ColumnConfig<IAudience>[];
  flows: ColumnConfig<IFlow>[];
  groups: ColumnConfig<IGroup>[];
  stagesEducation: ColumnConfig<IStageEducation>[];
  profiles: ColumnConfig<IProfile>[];
  specializations: ColumnConfig<ISpecialization>[];
  students: ColumnConfig<IStudentAdmin>[];
  teachers: ColumnConfig<ITeacherAdmin>[];
  markStrategies: ColumnConfig<IMarkStrategy>[];
  studentRoles: ColumnConfig<IStudentRole>[];
  criterias: ColumnConfig<ICriteria>[];
};

export const tableConfigs: TableConfigMap = {
  universities: universityColumns,
  buildings: buildingColumns,
  audiences: audienceColumns,
  flows: flowsColumns,
  groups: groupsColumns,
  stagesEducation: stagesEducationColumns,
  profiles: profilesColumns,
  specializations: specializationsColumns,
  students: studentsColumns,
  teachers: teachersColumns,
  markStrategies: markStrategiesColumns,
  studentRoles: studentRolesColumns,
  criterias: criteriasColumns,
};
