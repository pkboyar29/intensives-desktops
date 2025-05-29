export interface IAnswerOption {
  id?: number;
  text: string;
  value: number;
}
// вопрос, получаемый с сервера
export interface IQuestion {
  id: number;
  title: string;
  description: string;
  questionType: 'Один вариант ответа' | 'Несколько вариантов ответа';
  answerOptions?: IAnswerOption[];
}
// структура вопроса для отправки на сервер
export interface IQuestionCreate {
  title: string;
  description: string;
  questionType: 'single' | 'multiple';
  answerOptions: IAnswerOption[]; // // Убираем опциональность, так как варианты ответов всегда нужны
}

