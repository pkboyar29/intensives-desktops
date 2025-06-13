export interface IAnswerOption {
  id?: number;
  text: string;
  value: number;
}

export interface IQuestion {
  id: number;
  title: string;
  description: string;
  questionType: 'Один вариант ответа' | 'Несколько вариантов ответа';
  answerOptions: IAnswerOption[];
}

export interface IQuestionCreate {
  title: string;
  description: string;
  questionType: 'single' | 'multiple';
  answerOptions: IAnswerOption[];
}

