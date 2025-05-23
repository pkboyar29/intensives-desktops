import { FC, useState, useEffect } from 'react';
import {
  useCreateEventMarkMutation,
  useUpdateEventMarkMutation,
} from '../../redux/api/eventMarkApi';
import { validateKanban } from '../../helpers/kanbanHelpers';

import RangeSlider from '../common/RangeSlider';
import PrimaryButton from '../common/PrimaryButton';
import { toast } from 'react-toastify';

import { IEvent } from '../../ts/interfaces/IEvent';
import { IEventMark } from '../../ts/interfaces/IEventMark';

interface EventMarkFormProps {
  event: IEvent;
  eventAnswerId: number;
  existingEventMarks: IEventMark[];
  onChangeMarks: (updatedMarks: IEventMark[]) => void;
}

const EventMarkForm: FC<EventMarkFormProps> = ({
  event,
  eventAnswerId,
  existingEventMarks,
  onChangeMarks,
}) => {
  const [createEventMarks] = useCreateEventMarkMutation();
  const [updateEventMark] = useUpdateEventMarkMutation();

  const [eventMarks, setEventMarks] = useState<
    { id: number; criteriaId: number; mark: number; comment: string }[]
  >([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    if (existingEventMarks.length > 0) {
      // если оценки уже отправлены преподавателем
      setEventMarks(
        existingEventMarks.map((existingMark) => ({
          id: existingMark.id,
          mark: existingMark.mark,
          comment: existingMark.comment,
          criteriaId: existingMark.criteria?.id ?? 0,
        }))
      );
    } else {
      // иначе добавляем дефолтные оценки
      if (event.criterias.length === 0) {
        setEventMarks([
          {
            id: 0,
            criteriaId: 0,
            mark: event.markStrategy?.lowBound ?? 0,
            comment: '',
          },
        ]);
      } else {
        setEventMarks(
          event.criterias.map((criteria) => ({
            id: 0,
            criteriaId: criteria.id,
            mark: event.markStrategy?.lowBound ?? 0,
            comment: '',
          }))
        );
      }
    }
  }, [event, existingEventMarks]);

  const updateMark = (criteriaId: number, newMark: number) => {
    if (!isEditing) {
      setIsEditing(true);
    }

    setEventMarks((prevMarks) =>
      prevMarks.map((mark) =>
        mark.criteriaId === criteriaId ? { ...mark, mark: newMark } : mark
      )
    );
  };

  const updateComment = (criteriaId: number, newComment: string) => {
    if (!isEditing) {
      setIsEditing(true);
    }

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

  const displayMark = (mark: number) => {
    if (
      event.markStrategy &&
      event.markStrategy.lowBound === 0 &&
      event.markStrategy.highBound === 1
    ) {
      return mark === 0 ? 'Незачет' : 'Зачет';
    } else {
      return mark;
    }
  };

  const onSubmit = async () => {
    if (existingEventMarks.length === 0) {
      const { data: responseData, error: responseError } =
        await createEventMarks({
          eventAnswerId: eventAnswerId,
          marksToCreate: eventMarks.map((eventMark) => ({
            mark: eventMark.mark,
            comment: eventMark.comment,
            criteria: eventMark.criteriaId ? eventMark.criteriaId : null,
          })),
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
        setIsEditing(false);

        onChangeMarks(responseData);
      }
    } else {
      const updatedMarks = await Promise.all(
        eventMarks.map(async (mark) => {
          const { data: responseData, error: responseError } =
            await updateEventMark({
              eventMarkId: mark.id,
              mark: mark.mark,
              comment: mark.comment,
            });

          if (responseData) {
            return responseData;
          }

          if (responseError) {
            toast('Произошла серверная ошибка при отправке оценки', {
              type: 'error',
            });
            return null;
          }
        })
      );

      toast('Оценка успешно обновлена', {
        type: 'success',
      });
      setIsEditing(false);

      const validUpdatedMarks = updatedMarks.filter(
        (mark): mark is IEventMark => mark !== null && mark !== undefined
      );
      onChangeMarks(validUpdatedMarks);
    }
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
          <div className="flex flex-col items-center gap-2 sm:flex-row">
            <div className="text-lg">Общая оценка: </div>

            {event.markStrategy && (
              <div className="w-full sm:w-60">
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

            <div className="text-lg font-semibold">
              {displayMark(eventMarks[0]?.mark)}
            </div>
          </div>

          <textarea
            className="w-full p-3 text-base border-2 border-solid rounded-md shadow-md border-gray_3 focus:outline-none focus:border-blue"
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
              <div className="flex flex-col items-center justify-between w-full gap-2 sm:flex-row">
                <div className="text-lg">{criteria.name}</div>

                <div className="w-full text-center sm:w-auto">
                  {event.markStrategy && (
                    <div className="w-full sm:w-60">
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
                    {displayMark(
                      eventMarks.find((m) => m.criteriaId === criteria.id)
                        ?.mark ?? 0
                    )}
                  </div>
                </div>
              </div>

              <textarea
                className="w-full p-3 mt-3 text-base border-2 border-solid rounded-md shadow-md border-gray_3 focus:outline-none focus:border-blue"
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
        disabled={!isEditing}
        type="button"
        children={
          existingEventMarks.length > 0 ? 'Изменить оценку' : 'Отправить оценку'
        }
        clickHandler={onSubmit}
      />
    </div>
  );
};

export default EventMarkForm;
