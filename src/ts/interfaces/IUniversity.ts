export interface IUniversity {
  id: number;
  name: string;
}

export interface IUniversityCreate {
  name: string;
}

export interface IUniversityPatch {
  id: number;
  name?: string;
}
