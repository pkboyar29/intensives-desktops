import React from 'react';

interface AnswerOption {
  text: string;
  value: number;
}

interface QuestionCardProps {
  question: {
    id: number;
    title: string;
    description: string;
    answerOptions: AnswerOption[];
  };
  onEdit: (question: any) => void;
  onDelete: (question: any) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onEdit,
  onDelete,
}) => (
  <div className="p-4 mb-4 bg-white border rounded shadow">
    <h4 className="font-bold">{question.title}</h4>
    <p className="mb-2">{question.description}</p>
    <ul className="mb-2">
      {question.answerOptions.map((opt, idx) => (
        <li key={idx}>
          {opt.text} — {opt.value}
        </li>
      ))}
    </ul>
    <div className="flex gap-2">
      <button onClick={() => onEdit(question)} className="text-blue-500">
        Редактировать
      </button>
      <button onClick={() => onDelete(question)} className="text-red-500">
        Удалить
      </button>
    </div>
  </div>
);

export default QuestionCard;
