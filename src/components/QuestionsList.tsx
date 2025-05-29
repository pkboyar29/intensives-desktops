import React, { useState } from 'react';
import QuestionCard from './QuestionCard';
import QuestionModal from '../components/common/modals/QuestionModal';
import ConfirmDeleteModal from '../components/common/modals/ConfirmDeleteModal';

interface QuestionsListProps {
  questions: any[];
  onUpdate: () => void; // функция для обновления списка после редактирования/удаления
}

const QuestionsList: React.FC<QuestionsListProps> = ({
  questions,
  onUpdate,
}) => {
  const [editingQuestion, setEditingQuestion] = useState<any | null>(null);
  const [deletingQuestion, setDeletingQuestion] = useState<any | null>(null);

  // Здесь должны быть функции для удаления и обновления вопроса через API
  const handleDelete = async () => {
    if (deletingQuestion) {
      // await apiDeleteQuestion(deletingQuestion.id);
      setDeletingQuestion(null);
      onUpdate();
    }
  };

  return (
    <div>
      {questions.map((q) => (
        <QuestionCard
          key={q.id}
          question={q}
          onEdit={setEditingQuestion}
          onDelete={setDeletingQuestion}
        />
      ))}

      {editingQuestion && (
        <QuestionModal
          question={editingQuestion}
          onClose={() => {
            setEditingQuestion(null);
            onUpdate();
          }}
          // ...другие пропсы для обновления вопроса
        />
      )}

      {deletingQuestion && (
        <ConfirmDeleteModal
          onConfirm={handleDelete}
          onCancel={() => setDeletingQuestion(null)}
        />
      )}
    </div>
  );
};

export default QuestionsList;
