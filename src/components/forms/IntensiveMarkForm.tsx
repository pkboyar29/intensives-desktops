import { FC, useState, useEffect } from 'react';
import { useAppSelector } from '../../redux/store';
import {
  useCreateIntensiveMarkMutation,
  useUpdateIntensiveMarkMutation,
  useDeleteIntensiveMarkMutation,
} from '../../redux/api/intensiveMarkApi';
import { getTimeFromDate } from '../../helpers/dateHelpers';
import { toast } from 'react-toastify';

import Tag from '../common/Tag';
import RangeSlider from '../common/RangeSlider';
import PrimaryButton from '../common/PrimaryButton';

import { IIntensiveMark } from '../../ts/interfaces/IIntensiveMark';
import { IIntensiveAnswerMark } from '../../ts/interfaces/IIntensiveAnswer';
import { IStudentInTeam } from '../../ts/interfaces/ITeam';

interface IntensiveMarkFormProps {
  studentInTeam: IStudentInTeam;
  intensiveAnswerMark: IIntensiveAnswerMark;
  afterChangeMark: (updatedMark: IIntensiveMark) => void;
  afterDeleteMark: (studentId: number) => void;
}

const IntensiveMarkForm: FC<IntensiveMarkFormProps> = ({
  intensiveAnswerMark: { intensiveAnswer, intensiveMark },
  studentInTeam: { student, roles: studentRoles },
  afterChangeMark,
  afterDeleteMark,
}) => {
  const currentTeam = useAppSelector((state) => state.team.data);

  const [submitMark] = useCreateIntensiveMarkMutation();
  const [updateMark] = useUpdateIntensiveMarkMutation();
  const [deleteMark] = useDeleteIntensiveMarkMutation();

  const [mark, setMark] = useState<number>(2);
  const [comment, setComment] = useState<string>('');

  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    if (intensiveMark) {
      setMark(intensiveMark.mark);
      setComment(intensiveMark.comment);
    } else {
      setMark(2);
      setComment('');
    }
  }, [intensiveMark]);

  const onChangeMark = (newMark: number) => {
    if (!isEditing) {
      setIsEditing(true);
    }

    setMark(newMark);
  };

  const onChangeComment = (newComment: string) => {
    if (!isEditing) {
      setIsEditing(true);
    }

    setComment(newComment);
  };

  const onSubmit = async () => {
    if (!intensiveMark) {
      const { data: responseData, error: responseError } = await submitMark({
        mark: mark,
        comment: comment,
        student: student.id,
        teamId: currentTeam!.id,
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
        afterChangeMark(responseData);
      }
    } else {
      const { data: responseData, error: responseError } = await updateMark({
        id: intensiveMark.id,
        mark: mark,
        comment: comment,
      });

      if (responseError) {
        toast('Произошла серверная ошибка при изменении оценки', {
          type: 'error',
        });
        return;
      }

      if (responseData) {
        toast('Оценка успешно изменена', {
          type: 'success',
        });
        setIsEditing(false);
        afterChangeMark(responseData);
      }
    }
  };

  const onDelete = async () => {
    const { error: responseError } = await deleteMark(intensiveMark!.id);

    if (responseError) {
      toast('Произошла серверная ошибка при удалении оценки', {
        type: 'error',
      });
    } else {
      toast('Оценка успешно удалена', {
        type: 'success',
      });
      setIsEditing(false);
      afterDeleteMark(student.id);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[500px] w-full">
      <div className="flex flex-col gap-3">
        <div className="text-xl">{student.nameWithGroup}</div>
        {/* TODO: отображать надпись "Нет ролей", как-то проверять чтобы студент и не был тимлидом и у него не было ролей */}
        <div className="flex gap-2 ml-3">
          {currentTeam?.teamlead?.id === student.id && (
            <div>
              <Tag
                content={<div className="font-bold">Тимлид</div>}
                shouldHaveCrossIcon={false}
                deleteHandler={() => {}}
              />
            </div>
          )}
          {studentRoles.map((role) => (
            <div key={role.id}>
              <Tag
                content={role.name}
                shouldHaveCrossIcon={false}
                deleteHandler={() => {}}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-20 mt-4">
        <div className="w-32 text-base text-gray_3">Ответ</div>

        {intensiveAnswer ? (
          <div className="text-lg text-green-500">Ответ отправлен</div>
        ) : (
          <div className="text-lg text-red">Ответ не прикреплен</div>
        )}
      </div>

      <div className="flex items-center gap-20">
        <div className="w-32 text-base text-gray_3">Статус оценивания</div>

        {intensiveMark ? (
          <div>
            <div className="text-lg text-green-500">Оценено</div>
            <div className="text-gray_3">
              {intensiveMark.updatedDate.toLocaleDateString()},{' '}
              {getTimeFromDate(intensiveMark.updatedDate)}
            </div>
          </div>
        ) : (
          <div className="text-lg text-red">Не оценено</div>
        )}
      </div>

      <div className="flex items-center gap-20">
        <div className="w-32 text-base text-gray_3">Оценка</div>

        <div className="flex items-center gap-4">
          <RangeSlider
            minValue={2}
            maxValue={5}
            currentValue={mark}
            changeCurrentValue={onChangeMark}
          />

          <div className="text-lg font-semibold">{mark}</div>
        </div>
      </div>

      <div className="flex gap-20">
        <div className="w-32 text-base shrink-0 text-gray_3">Комментарий</div>

        <textarea
          className="w-full p-3 text-base border-2 border-solid rounded-md border-gray_3 focus:outline-none focus:border-blue"
          value={comment}
          onChange={(e) => {
            onChangeComment(e.target.value);
          }}
          rows={4}
          maxLength={500}
          placeholder="Введите комментарий..."
        />
      </div>

      <div className="flex gap-4">
        <div>
          <PrimaryButton
            disabled={!isEditing}
            type="button"
            children={intensiveMark ? 'Изменить оценку' : 'Отправить оценку'}
            clickHandler={onSubmit}
          />
        </div>

        {intensiveMark && (
          <div>
            <PrimaryButton
              type="button"
              children="Удалить оценку"
              buttonColor="red"
              clickHandler={onDelete}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default IntensiveMarkForm;
