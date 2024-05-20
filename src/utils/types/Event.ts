import { Team } from "./Team"

export type Event = {
   id: number,
   name: string,
   descr: string,
   stage: string,
   startDate: Date,
   finishDate: Date,
   auditory: string,
   markStrategy: string | null,
   criterias: string[] | null,
   teams: Team[]
}