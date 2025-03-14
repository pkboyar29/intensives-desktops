import { FC, useState } from 'react';
import { getDateTimeDisplay } from '../helpers/dateHelpers';

import { IEventMark } from '../ts/interfaces/IEventMark';
import { IMarkStrategy } from '../ts/interfaces/IMarkStrategy';

type TeacherMarkCardProps = {
  teacherMarks: IEventMark[];
  markStrategy: IMarkStrategy;
};

const TeacherMarkCard: FC<TeacherMarkCardProps> = ({
  teacherMarks,
  markStrategy,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const teacher = teacherMarks[0].teacher;
  const createdDate = getDateTimeDisplay(teacherMarks[0].createdDate);
  const averageMark =
    teacherMarks.reduce((sum, mark) => sum + mark.mark, 0) /
    teacherMarks.length;

  return (
    <div className="w-full p-4 mx-auto bg-white border rounded-lg shadow-md max-w">
      <div className="flex items-center justify-between pb-2 text-lg border-b">
        <h2 className="text-lg font-semibold">Преподаватель: {teacher.name}</h2>
        <span className="text-base">{createdDate}</span>
      </div>

      {teacherMarks.length === 1 ? (
        <div className="mt-2 text-lg">
          <div className="flex gap-2">
            <span className="font-semibold">Общая оценка:</span>{' '}
            <span className="font-bold text-blue">{teacherMarks[0].mark}</span>
          </div>
          {teacherMarks[0].comment.length > 0 && (
            <div className="flex gap-2">
              <span className="font-semibold">Комментарий:</span>
              <span className="font-bold">{teacherMarks[0].comment}</span>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="mt-2 text-lg">
            <span className="font-semibold">Общая оценка:</span>{' '}
            <span className="font-bold text-blue">
              {averageMark.toFixed(1)} / {markStrategy.highBound}
            </span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full mt-2 text-left hover:underline"
          >
            {isExpanded ? 'Скрыть критерии' : 'Показать критерии'}
          </button>

          {isExpanded && (
            <div className="px-4 py-2 mt-2 border rounded-md">
              {teacherMarks.map((mark) => (
                <div
                  key={mark.id}
                  className="py-2 space-y-2 border-b last:border-none"
                >
                  <p className="font-semibold">
                    Критерий: {mark.criteria?.name}
                  </p>
                  <p>
                    Оценка:{' '}
                    <span className="font-bold text-green-600">
                      {mark.mark}
                    </span>
                  </p>
                  {mark.comment && (
                    <p className="text-sm">Комментарий: {mark.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TeacherMarkCard;
