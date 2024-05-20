import { EducationRequest } from '../utils/types/EducationRequest'

export const educationRequests: EducationRequest[] = [
   {
      id: 1,
      subject: "Нужен мастеркласс по Unity",
      descr: "Хотелось бы узнать основы создания игр на Unity.",
      teamNumber: 1,
      ownerName: "Иванов Иван Иванович",
      createdDate: new Date('2024-05-01')
   },
   {
      id: 2,
      subject: "Нужен мастеркласс по React",
      descr: "Хотелось бы углубиться в работу с React и Redux.",
      teamNumber: 2,
      ownerName: "Петров Петр Петрович",
      createdDate: new Date('2024-05-02')
   },
   {
      id: 3,
      subject: "Нужен мастеркласс по Data Science",
      descr: "Интересует работа с большими данными и машинное обучение.",
      teamNumber: 3,
      ownerName: "Сидоров Сидор Сидорович",
      createdDate: new Date('2024-05-03')
   },
   {
      id: 4,
      subject: "Нужен мастеркласс по Docker",
      descr: "Хотелось бы понять основы контейнеризации с Docker.",
      teamNumber: 4,
      ownerName: "Кузнецов Алексей Андреевич",
      createdDate: new Date('2024-05-04')
   }
]