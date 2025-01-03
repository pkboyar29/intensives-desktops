import React, { useState } from 'react';
import { FC } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import KanbanColumnMenu from './KanbanColumnMenu';
import KanbanTask from './KanbanTask';

interface KanbanColumnProps {
  id: number;
  index: number;
  title: string;
  colorHEX: string;
  moveColumn: (dragIndex: number, hoverIndex: number) => void;
  onUpdateTitle: (id: number, newTitle: string) => void;
  onDeleteColumn: (id: number) => void;
}

const KanbanColumn: FC<KanbanColumnProps> = ({
  id,
  index,
  title,
  colorHEX,
  moveColumn,
  onUpdateTitle,
  onDeleteColumn
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTitle(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (currentTitle !== title) {
      onUpdateTitle(id, currentTitle); // Вызываем функцию обновления названия на беке
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      if (currentTitle !== title) {
        onUpdateTitle(id, currentTitle);
      }
    }
  };

  // Прекращаем drag, если поле ввода активно
  const preventDrag = (e: React.MouseEvent) => {
    if (isEditing) {
      e.preventDefault();
    }
  };

  const renameColumn = () => {
    setIsEditing(true); // Включаем режим редактирования
  };

  const deleteColumn = () => {
    onDeleteColumn(id)
  };

  // Используем DnD hook для перемещения колонки
  const [{ isDragging }, dragRef] = useDrag({
    type: 'COLUMN',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: 'COLUMN',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveColumn(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => dragRef(dropRef(node))}
      className={`w-80 p-4 bg-white rounded-lg shadow-md border-t-4 ${
        isDragging ? 'opacity-50' : ''
      }`}
      style={{ borderTopColor: colorHEX }}
      onMouseDown={preventDrag}
    >
      <div className="flex flex-row items-start justify-between">
        <div className="flex items-center justify-between mb-2 group">
          {isEditing ? (
            <input
              type="text"
              value={currentTitle}
              onChange={handleInputChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              maxLength={50}
              autoFocus
              className="w-full text-xl font-semibold text-gray-700 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 "
            />
          ) : (
            <h2
              className="text-xl font-semibold text-gray-700 cursor-pointer"
              onDoubleClick={renameColumn}
            >
              {currentTitle}
            </h2>
          )}
        </div>

        <KanbanColumnMenu onRename={renameColumn} onDelete={deleteColumn} />
      </div>
      <button className="w-full text-left text-blue hover:text-dark_blue">
        + Создать задачу
      </button>

      <div className="mt-4 space-y-2">
        <KanbanTask id={'INT-1'} title="Задача 1" isCompleted={false} />
        <KanbanTask id={'INT-2'} title="Задача 2" isCompleted={false} />
      </div>
    </div>
  );
};

export default KanbanColumn;
