import { FC, useState } from 'react';
import { IEventMark } from '../ts/interfaces/IEventMark';
import { getDateTimeDisplay } from '../helpers/dateHelpers';

type TeacherMarkCardProps = {
  teacherMarks: IEventMark[];
};

const TeacherMarkCard: FC<TeacherMarkCardProps> = ({ teacherMarks }) => {
  if (teacherMarks.length === 0) return null;

  const [isExpanded, setIsExpanded] = useState(true);

  const teacher = teacherMarks[0].teacher;
  const createdDate = getDateTimeDisplay(teacherMarks[0].createdDate);
  const averageMark =
    teacherMarks.reduce((sum, mark) => sum + mark.mark, 0) /
    teacherMarks.length;

  return (
    <div className="w-full p-4 mx-auto bg-white border rounded-lg shadow-md max-w">
      {/* Заголовок */}
      <div className="flex items-center justify-between pb-2 border-b">
        <h2 className="text-lg font-semibold">
          Преподаватель: Имя{teacher.name}
        </h2>
        <span className="text-sm text-gray-500">{createdDate}</span>
      </div>

      {/* Общая оценка */}
      <div className="p-2 mt-2 bg-gray-100 rounded-md">
        <span className="font-semibold">Общая оценка:</span>{' '}
        <span className="font-bold text-blue-600">
          {averageMark.toFixed(1)} / 5
        </span>
      </div>

      {/* Кнопка сворачивания критериев */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full mt-2 text-left text-blue-500 hover:underline"
      >
        {isExpanded ? 'Скрыть критерии' : 'Показать критерии'}
      </button>

      {/* Список критериев */}
      {isExpanded && (
        <div className="p-2 mt-2 border rounded-md">
          {teacherMarks.map((mark) => (
            <div
              key={mark.id}
              className="py-2 space-y-2 border-b last:border-none"
            >
              <p className="font-semibold">Критерий: {mark.criteria}</p>
              <p>
                Оценка:{' '}
                <span className="font-bold text-green-600">{mark.mark}</span>
              </p>
              <p className="text-sm text-gray-600">
                Комментарий: {mark.comment}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Общий комментарий */}
      <div className="p-2 mt-2 rounded-md bg-gray-50">
        <span className="font-semibold">Общий комментарий:</span>{' '}
        <span className="italic text-gray-700">
          "Хорошая работа, но можно добавить примеры."
        </span>
      </div>
    </div>
  );
};

export default TeacherMarkCard;
