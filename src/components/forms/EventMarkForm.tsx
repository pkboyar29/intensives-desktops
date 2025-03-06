import { FC, useState, useEffect } from 'react';
import {
  useCreateEventMarkMutation,
  useCreateCriteriaMarksMutation,
} from '../../redux/api/eventMarkApi';
import { validateKanban } from '../../helpers/kanbanHelpers';

import { IEvent } from '../../ts/interfaces/IEvent';

import RangeSlider from '../common/RangeSlider';
import PrimaryButton from '../common/PrimaryButton';
import { toast } from 'react-toastify';

// TODO: начать получать eventMark, который может быть null - в таком случае мы отправляем новую оценку, а не изменяем ее
interface EventMarkFormProps {
  event: IEvent;
  eventAnswerId: number;
}

const EventMarkForm: FC<EventMarkFormProps> = ({ event, eventAnswerId }) => {
  const [createEventMark] = useCreateEventMarkMutation();
  const [createCriteriaMarks] = useCreateCriteriaMarksMutation();

  const [eventMarks, setEventMarks] = useState<
    { criteriaId: number; mark: number; comment: string }[]
  >([]);

  useEffect(() => {
    // TODO: при существовании eventMark заполнять сразу currentMark и comment, иначе просто в currentMark записать event.lowBound

    if (event.criterias.length === 0) {
      setEventMarks([
        { criteriaId: 0, mark: event.markStrategy?.lowBound ?? 0, comment: '' },
      ]);
    } else {
      setEventMarks(
        event.criterias.map((criteria) => ({
          criteriaId: criteria.id,
          mark: event.markStrategy?.lowBound ?? 0,
          comment: '',
        }))
      );
    }
  }, [event]);

  const updateMark = (criteriaId: number, newMark: number) => {
    setEventMarks((prevMarks) =>
      prevMarks.map((mark) =>
        mark.criteriaId === criteriaId ? { ...mark, mark: newMark } : mark
      )
    );
  };

  const updateComment = (criteriaId: number, newComment: string) => {
    if (validateKanban(newComment)) {
      setEventMarks((prevMarks) =>
        prevMarks.map((mark) =>
          mark.criteriaId === criteriaId
            ? { ...mark, comment: newComment }
            : mark
        )
      );
    }
  };

  const onSubmit = async () => {
    if (event.criterias.length === 0) {
      const { data: responseData, error: responseError } =
        await createEventMark({
          mark: eventMarks[0].mark,
          comment: eventMarks[0].comment,
          eventAnswerId: eventAnswerId,
        });

      if (responseError) {
        toast('Произошла серверная ошибка при отправке оценки', {
          type: 'error',
        });
        return;
      }

      if (responseData) {
        toast('Оценка успешно отправлена', {
          type: 'success',
        });
      }
    } else {
      const { data: responseData, error: responseError } =
        await createCriteriaMarks(
          eventMarks.map((eventMark) => ({
            mark: eventMark.mark,
            comment: eventMark.comment,
            criteria: eventMark.criteriaId,
            eventAnswerId: eventAnswerId,
          }))
        );

      if (responseError) {
        toast('Произошла серверная ошибка при отправке оценок по критериям', {
          type: 'error',
        });
        return;
      }

      if (responseData) {
        toast('Оценки успешно отправлены', {
          type: 'success',
        });
      }
    }
    // TODO: передавать в компонент пропсом метод, чтобы изменять состояние извне в обоих случаях
  };

  return (
    <div className="flex flex-col gap-3 mt-5">
      <p className="text-lg font-medium text-center">Оценивание ответа</p>

      <div className="text-lg">
        Шкала оценивания - {event.markStrategy?.name}
      </div>

      {event.criterias.length === 0 ? (
        // если тип оценивания - по шкале
        <>
          <div className="flex items-center gap-2">
            <div className="text-lg">Общая оценка: </div>

            {event.markStrategy && (
              <div className="w-60">
                <RangeSlider
                  minValue={event.markStrategy.lowBound}
                  maxValue={event.markStrategy.highBound}
                  currentValue={eventMarks[0]?.mark}
                  changeCurrentValue={(newCurrentMark) =>
                    updateMark(0, newCurrentMark)
                  }
                />
              </div>
            )}

            <div className="text-lg font-semibold">{eventMarks[0]?.mark}</div>
          </div>

          <textarea
            className="w-full p-3 text-base border-2 border-solid rounded-md border-gray_3 focus:outline-none focus:border-blue"
            value={eventMarks[0]?.comment}
            onChange={(e) => updateComment(0, e.target.value)}
            rows={4}
            maxLength={500}
            placeholder="Введите комментарий..."
          />
        </>
      ) : (
        // если тип оценивания - по шкале с критериями
        <>
          {event.criterias.map((criteria) => (
            <div key={criteria.id}>
              <div className="flex items-center justify-between gap-2">
                <div className="text-lg">{criteria.name}</div>

                <div className="flex items-center gap-2">
                  {event.markStrategy && (
                    <div className="w-60">
                      <RangeSlider
                        minValue={event.markStrategy?.lowBound}
                        maxValue={event.markStrategy?.highBound}
                        currentValue={
                          eventMarks.find((m) => m.criteriaId === criteria.id)
                            ?.mark || 0
                        }
                        changeCurrentValue={(newCurrentMark) =>
                          updateMark(criteria.id, newCurrentMark)
                        }
                      />
                    </div>
                  )}

                  <div className="text-lg font-semibold">
                    {eventMarks.find((m) => m.criteriaId === criteria.id)?.mark}
                  </div>
                </div>
              </div>

              <textarea
                className="w-full p-3 mt-3 text-base border-2 border-solid rounded-md border-gray_3 focus:outline-none focus:border-blue"
                value={
                  eventMarks.find((m) => m.criteriaId === criteria.id)?.comment
                }
                onChange={(e) => updateComment(criteria.id, e.target.value)}
                rows={2}
                maxLength={500}
                placeholder="Введите комментарий по критерию..."
              />
            </div>
          ))}
        </>
      )}

      <PrimaryButton
        type="button"
        children={'Отправить оценку'}
        clickHandler={onSubmit}
      />
    </div>
  );
};

export default EventMarkForm;
