import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppSelector } from '../../../redux/store';
import { isUserManager } from '../../../helpers/userHelpers';
import {
  useSendEducationRequestAnswerMutation,
  useUpdateEducationRequestAnswerMutation,
  useDeleteEducationRequestAnswerMutation,
} from '../../../redux/api/educationRequestAnswerApi';
import { getRussianDateDisplay } from '../../../helpers/dateHelpers';

import Modal from './Modal';
import InputDescription from '../inputs/InputDescription';
import TrashIcon from '../../icons/TrashIcon';
import PrimaryButton from '../PrimaryButton';
import { ToastContainer, toast } from 'react-toastify';

import {
  IEducationRequest,
  IEducationRequestAnswer,
} from '../../../ts/interfaces/IEducationRequest';

interface EducationRequestAnswerModalProps {
  request: IEducationRequest;
  onClose: () => void;
  onCancel: () => void;
  onChangeRequest: (request: IEducationRequest) => void;
}

interface EducationRequestAnswerFields {
  comment: string;
}

const EducationRequestAnswerModal: FC<EducationRequestAnswerModalProps> = ({
  request,
  onClose,
  onCancel,
  onChangeRequest,
}) => {
  const currentUser = useAppSelector((state) => state.user.data);

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EducationRequestAnswerFields>({
    mode: 'onBlur',
    defaultValues: {
      comment: request.answer?.comment,
    },
  });

  const [sendAnswer] = useSendEducationRequestAnswerMutation();
  const [updateAnswer] = useUpdateEducationRequestAnswerMutation();
  const [deleteAnswer] = useDeleteEducationRequestAnswerMutation();

  const onSubmit = async (data: EducationRequestAnswerFields) => {
    if (request.answer) {
      const { data: responseData, error: responseError } = await updateAnswer({
        ...data,
        answerId: request.answer.id,
      });

      if (responseError) {
        toast('Произошла серверная ошибка при обновлении ответа', {
          type: 'error',
        });
      }

      if (responseData) {
        onChangeRequest({ ...request, answer: responseData });
      }
    } else {
      const { data: responseData, error: responseError } = await sendAnswer({
        ...data,
        requestId: request.id,
      });

      if (responseError) {
        toast('Произошла серверная ошибка при отправке ответа', {
          type: 'error',
        });
      }

      if (responseData) {
        onChangeRequest({ ...request, answer: responseData });
      }
    }
  };

  const editButtonClickHandler = () => {
    setIsEditing(true);
  };

  const deleteButtonClickHandler = async () => {
    const { error } = await deleteAnswer(request.answer!.id);

    if (error) {
      toast('Произошла серверная ошибка при удалении ответа', {
        type: 'error',
      });
    } else {
      onChangeRequest({ ...request, answer: null });
    }
  };

  const EducationRequestAnswerForm: FC = () => {
    return (
      <>
        <InputDescription
          isTextArea={true}
          register={register}
          fieldName="comment"
          registerOptions={{
            required: 'Поле обязательно к заполнению',
            maxLength: {
              value: 500,
              message: 'Максимальное количество символов - 500',
            },
          }}
          placeholder="Комментарий"
          errorMessage={
            typeof errors.comment?.message === 'string'
              ? errors.comment.message
              : ''
          }
        />

        <div className="flex justify-end gap-3 mt-6">
          <div>
            <PrimaryButton
              buttonColor="gray"
              clickHandler={() => {
                if (isEditing) {
                  setIsEditing(false);
                } else {
                  onCancel();
                }
              }}
              children="Отмена"
            />
          </div>
          <div>
            <PrimaryButton
              type="submit"
              clickHandler={handleSubmit(onSubmit)}
              children={request.answer ? 'Изменить' : 'Отправить'}
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <ToastContainer position="top-center" />

      <Modal
        title={
          <>
            {request.answer
              ? isEditing
                ? 'Изменение'
                : 'Просмотр'
              : 'Отправка'}{' '}
            ответа на запрос: {request.subject}
          </>
        }
        onCloseModal={onClose}
      >
        {request.answer ? (
          isEditing ? (
            <EducationRequestAnswerForm />
          ) : (
            <div className="flex flex-col gap-3">
              <div className="text-lg text-bright_gray">
                Комментарий: {request.answer.comment}
              </div>

              <div className="flex justify-end mt-3 text-black_3 whitespace-nowrap">
                {getRussianDateDisplay(request.answer.createdDate)}
              </div>

              {isUserManager(currentUser) && (
                <div className="flex justify-end gap-2">
                  <div>
                    <PrimaryButton
                      children="Редактировать"
                      clickHandler={editButtonClickHandler}
                    />
                  </div>

                  <div>
                    <PrimaryButton
                      buttonColor="gray"
                      children={<TrashIcon />}
                      onClick={deleteButtonClickHandler}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        ) : (
          isUserManager(currentUser) && <EducationRequestAnswerForm />
        )}
      </Modal>
    </>
  );
};

export default EducationRequestAnswerModal;
