import { Event } from '../utils/types/Event'

export const events: Event[] = [
   {
      id: 1,
      name: "Ретроспектива",
      descr: "Обсуждение прошедших спринтов и определение направлений для улучшения.",
      stage: "Этап 1",
      startDate: new Date(2024, 4, 20),
      finishDate: new Date(2024, 4, 21),
      auditory: "Аудитория 123",
      markStrategy: "пятибальная шкала",
      criterias: ["качество", "командная работа"],
      teams: [
         { id: 1, name: "Команда 1" },
         { id: 2, name: "Команда 2" },
         { id: 3, name: "Команда 3" }
      ]
   },
   {
      id: 2,
      name: "Мастер класс по Unity",
      descr: "Изучение основ разработки игр на Unity.",
      stage: "Этап 2",
      startDate: new Date(2024, 5, 15),
      finishDate: new Date(2024, 5, 16),
      auditory: "Аудитория 204",
      markStrategy: null,
      criterias: null,
      teams: [
         { id: 1, name: "Команда 1" },
         { id: 2, name: "Команда 2" },
         { id: 3, name: "Команда 3" }
      ]
   },
   {
      id: 3,
      name: "Семинар по Agile",
      descr: "Обсуждение принципов Agile и их применение в проектах.",
      stage: "Этап 1",
      startDate: new Date(2024, 6, 10),
      finishDate: new Date(2024, 6, 11),
      auditory: "Аудитория 502",
      markStrategy: "зачет/незачет",
      criterias: null,
      teams: [
         { id: 1, name: "Команда 1" },
         { id: 2, name: "Команда 2" },
         { id: 3, name: "Команда 3" }
      ]
   },
   {
      id: 4,
      name: "Конкурс стартапов",
      descr: "Презентация и оценка стартапов участниками и жюри.",
      stage: "Этап 2",
      startDate: new Date(2024, 7, 20),
      finishDate: new Date(2024, 7, 21),
      auditory: "Аудитория 123",
      markStrategy: "стобальная шкала",
      criterias: ["инновационность", "потенциал рынка", "реализация"],
      teams: [
         { id: 1, name: "Команда 1" },
         { id: 2, name: "Команда 2" },
         { id: 3, name: "Команда 3" }
      ]
   }
]
