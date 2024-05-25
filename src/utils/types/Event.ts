import { Team } from './Team'

export type Event = {
   id: number,
   name: string,
   description: string,
   stageId: number,
   stageName: string,
   startDate: Date,
   finishDate: Date,
   auditoryId: number,
   auditoryName: string,
   markStrategyId: number,
   markStrategyName: string,
   criterias: number[] | null,
   criteriasNames: string[] | null,
   teams: Team[],
   teachers_command: number[],
   isCurrentTeacherJury: boolean
}