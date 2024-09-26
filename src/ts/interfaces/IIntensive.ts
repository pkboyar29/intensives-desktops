export interface IIntensive {
  id: number;
  name: string;
  description: string;
  isOpen: boolean;
  open_dt: Date;
  close_dt: Date;
  flow: string;
}

export interface IIntensiveCreate {
  name: string;
  description: string;
  open_dt: string;
  close_dt: string;
}

export interface IIntensiveUpdate {
  id: number;
  name: string;
  description: string;
  open_dt: string;
  close_dt: string;
}
