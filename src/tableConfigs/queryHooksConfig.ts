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
  useLazyGetStudentsAdminQuery,
  useRegisterStudentMutation,
} from '../redux/api/studentApi';
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
  update: useUpdateEducationMutation,
  delete: useDeleteEducationMutation,
};

export const queryHooksMap = {
  universities: universityHooks,
  buildings: buildingHooks,
  audiences: audienceHooks,
  flows: flowHooks,
  groups: groupHooks,
  education: educationHooks,
  students: studentsHooks,
};
