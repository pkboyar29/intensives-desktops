import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  useSendEducationRequestAnswerMutation,
  useUpdateEducationRequestAnswerMutation,
  useDeleteEducationRequestAnswerMutation,
} from '../../../redux/api/educationRequestAnswerApi';

import Modal from './Modal';
import InputDescription from '../inputs/InputDescription';
import PrimaryButton from '../PrimaryButton';
import { ToastContainer, toast } from 'react-toastify';

import { IEducationRequest } from '../../../ts/interfaces/IEducationRequest';

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
  const { intensiveId } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EducationRequestAnswerFields>({
    mode: 'onBlur',
    defaultValues: {
      // comment: request.answer.comment
    },
  });

  const [sendAnswer] = useSendEducationRequestAnswerMutation();
  const [updateAnswer] = useUpdateEducationRequestAnswerMutation();
  const [deleteAnswer] = useDeleteEducationRequestAnswerMutation();

  const onSubmit = async (data: EducationRequestAnswerFields) => {
    if (request.answer) {
      const response = await updateAnswer({
        ...data,
        answerId: request.answer.id,
      });

      console.log('обновление');
      console.log(response);

      // TODO: вызов onChange
    } else {
      const response = await sendAnswer({ ...data, requestId: request.id });

      console.log('создание');
      console.log(response);

      // TODO: вызов onChange
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />

      <Modal
        title={
          <>
            {request.answer ? 'Изменение' : 'Отправка'} ответа на запрос:{' '}
            {request.subject}
          </>
        }
        onCloseModal={onClose}
      >
        <InputDescription
          isTextArea={true}
          register={register}
          fieldName="comment"
          registerOptions={{
            required: 'Поле обязательно к заполнению',
            maxLength: {
              value: 50,
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
              clickHandler={onCancel}
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
      </Modal>
    </>
  );
};

export default EducationRequestAnswerModal;
