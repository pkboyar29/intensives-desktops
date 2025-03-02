import { FC, useState } from 'react';
import { IEventAnswerShort } from '../ts/interfaces/IEventAnswer';
import { getISODateInUTC3, getISODateTimeInUTC3 } from '../helpers/dateHelpers';

type EventAnswerListProps = {
  eventAnswersShort: IEventAnswerShort[];
  clickEventAnswer: (id: number) => void;
};

const EventAnswerList: FC<EventAnswerListProps> = ({
  eventAnswersShort,
  clickEventAnswer,
}) => {
  return (
    <div className="p-4 mx-auto bg-white rounded-lg shadow-md max-w">
      <p className="mb-4 text-xl font-semibold"></p>
      {eventAnswersShort && eventAnswersShort.length > 0 ? (
        eventAnswersShort.map((eventAnswer, index) => (
          <div
            key={eventAnswer.id}
            className={`p-4 mb-2 rounded-lg shadow-sm cursor-pointer duration-75 border hover:text-blue
              ${eventAnswer.hasMarks ? 'border-green-400' : ''}`}
            onClick={() => clickEventAnswer(eventAnswer.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex space-x-3 justify-left">
                <p className="text-lg font-semibold">{index + 1}.</p>
                <p className="text-lg font-medium">
                  Ответ от {getISODateTimeInUTC3(eventAnswer.createdDt)}
                </p>
              </div>
              {eventAnswer.hasMarks && (
                <span className="text-sm font-semibold text-green-700">
                  ✅ Оценен
                </span>
              )}
            </div>
          </div>
        ))
      ) : (
        <></>
      )}
    </div>
  );
};

export default EventAnswerList;
