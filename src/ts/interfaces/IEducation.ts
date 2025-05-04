export interface IStageEducation {
  id: number;
  name: string;
}

export interface IProfile {
  id: number;
  name: string;
  specialization: ISpecialization;
}

export interface ISpecialization {
  id: number;
  name: string;
  code: string;
}

export interface IStageEducationCreate {
  name: string;
}

export interface IProfileCreate {
  name: string;
}

export interface ISpecializationCreate {
  name: string;
  code: string;
}

export interface IStageEducationPatch {
  id: number;
  name?: string;
}

export interface IProfilePatch {
  id: number;
  name?: string;
}

export interface ISpecializationPatch {
  id: number;
  name?: string;
  code?: string;
}
