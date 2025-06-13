import {
  useCreateAudienceMutation,
  useDeleteAudienceMutation,
  useLazyGetAudiencesQuery,
  useUpdateAudienceMutation,
} from '../redux/api/audienceApi';
import {
  useCreateBuildingMutation,
  useDeleteBuildingMutation,
  useLazyGetBuildingsQuery,
  useUpdateBuildingMutation,
} from '../redux/api/buildingApi';
import {
  useCreateCriteriaMutation,
  useDeleteCriteriaMutation,
  useLazyGetCriteriasQuery,
  useUpdateCriteriaMutation,
} from '../redux/api/criteriaApi';
import {
  useCreateEducationMutation,
  useDeleteEducationMutation,
  useLazyGetEducationQuery,
  useUpdateEducationMutation,
} from '../redux/api/educationApi';
import {
  useCreateFlowMutation,
  useDeleteFlowMutation,
  useLazyGetFlowsQuery,
  useUpdateFlowMutation,
} from '../redux/api/flowApi';
import {
  useCreateGroupMutation,
  useDeleteGroupMutation,
  useLazyGetGroupsQuery,
  useUpdateGroupMutation,
} from '../redux/api/groupApi';
import {
  useCreateMarkStrategyMutation,
  useDeleteMarkStrategyMutation,
  useLazyGetMarkStrategiesQuery,
  useUpdateMarkStrategyMutation,
} from '../redux/api/markStrategyApi';
import {
  useDeleteStudentMutation,
  useLazyGetStudentsAdminQuery,
  useRegisterStudentMutation,
  useUpdateStudentMutation,
} from '../redux/api/studentApi';
import {
  useCreateStudentRoleMutation,
  useDeleteStudentRoleMutation,
  useLazyGetStudentRolesQuery,
  useUpdateStudentRoleMutation,
} from '../redux/api/studentRoleApi';
import {
  useDeleteTeacherMutation,
  useLazyGetTeachersAdminQuery,
  useRegisterTeacherMutation,
  useUpdateTeacherMutation,
} from '../redux/api/teacherApi';
import {
  useCreateUniversityMutation,
  useDeleteUniversityMutation,
  useLazyGetUniversitiesQuery,
  useUpdateUniversityMutation,
} from '../redux/api/universityApi';

export type EntitiesQueryHooks =
  (typeof queryHooksMap)[keyof typeof queryHooksMap];

const universityHooks = {
  view: useLazyGetUniversitiesQuery,
  create: useCreateUniversityMutation,
  update: useUpdateUniversityMutation,
  delete: useDeleteUniversityMutation,
};

const buildingHooks = {
  view: useLazyGetBuildingsQuery,
  create: useCreateBuildingMutation,
  update: useUpdateBuildingMutation,
  delete: useDeleteBuildingMutation,
};

const audienceHooks = {
  view: useLazyGetAudiencesQuery,
  create: useCreateAudienceMutation,
  update: useUpdateAudienceMutation,
  delete: useDeleteAudienceMutation,
};

const flowHooks = {
  view: useLazyGetFlowsQuery,
  create: useCreateFlowMutation,
  update: useUpdateFlowMutation,
  delete: useDeleteFlowMutation,
};

const groupHooks = {
  view: useLazyGetGroupsQuery,
  create: useCreateGroupMutation,
  update: useUpdateGroupMutation,
  delete: useDeleteGroupMutation,
};

const educationHooks = {
  view: useLazyGetEducationQuery,
  create: useCreateEducationMutation,
  update: useUpdateEducationMutation,
  delete: useDeleteEducationMutation,
};

const studentsHooks = {
  view: useLazyGetStudentsAdminQuery,
  create: useRegisterStudentMutation,
  update: useUpdateStudentMutation,
  delete: useDeleteStudentMutation,
};

const teachersHooks = {
  view: useLazyGetTeachersAdminQuery,
  create: useRegisterTeacherMutation,
  update: useUpdateTeacherMutation,
  delete: useDeleteTeacherMutation,
};

const markStrategiesHooks = {
  view: useLazyGetMarkStrategiesQuery,
  create: useCreateMarkStrategyMutation,
  update: useUpdateMarkStrategyMutation,
  delete: useDeleteMarkStrategyMutation,
};

const studentRolesHooks = {
  view: useLazyGetStudentRolesQuery,
  create: useCreateStudentRoleMutation,
  update: useUpdateStudentRoleMutation,
  delete: useDeleteStudentRoleMutation,
};

const criteriasHooks = {
  view: useLazyGetCriteriasQuery,
  create: useCreateCriteriaMutation,
  update: useUpdateCriteriaMutation,
  delete: useDeleteCriteriaMutation,
};

export const queryHooksMap = {
  universities: universityHooks,
  buildings: buildingHooks,
  audiences: audienceHooks,
  flows: flowHooks,
  groups: groupHooks,
  education: educationHooks,
  students: studentsHooks,
  teachers: teachersHooks,
  markStrategy: markStrategiesHooks,
  studentRoles: studentRolesHooks,
  criterias: criteriasHooks,
};
