import { FC, useState } from 'react';
import {
  getDateTimeDisplay,
  getISODateInUTC3,
  getISODateTimeInUTC3,
} from '../helpers/dateHelpers';

import { IEventAnswer, IEventAnswerShort } from '../ts/interfaces/IEventAnswer';

type EventAnswerListProps = {
  eventAnswers: IEventAnswer[];
  expandedAnswer?: number | null;
  clickEventAnswer: (id: number) => void;
};

const EventAnswerList: FC<EventAnswerListProps> = ({
  eventAnswers,
  expandedAnswer,
  clickEventAnswer,
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w">
      {eventAnswers.map((eventAnswer, index) => (
        <div
          key={eventAnswer.id}
          className={`p-4 mb-2 rounded-lg shadow-sm cursor-pointer duration-75 border hover:text-blue
              ${
                eventAnswer?.marks && eventAnswer.marks.length > 0
                  ? 'border-green-400'
                  : ''
              } ${
            expandedAnswer && expandedAnswer == eventAnswer.id
              ? 'text-dark_blue'
              : ''
          }`}
          onClick={() => clickEventAnswer(eventAnswer.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex space-x-3 justify-left">
              <p className="text-lg font-semibold">{index + 1}.</p>
              <p className="text-lg font-medium">
                Ответ от {getDateTimeDisplay(eventAnswer.createdDate)}
              </p>
            </div>

            {eventAnswer?.marks && eventAnswer.marks.length > 0 && (
              <span className="text-sm font-semibold text-green-700">
                ✅ Оценен
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventAnswerList;
