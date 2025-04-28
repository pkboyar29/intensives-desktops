import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  useSendEducationRequestMutation,
  useUpdateEducationRequestMutation,
} from '../../../redux/api/educationRequestApi';

import Modal from '../modals/Modal';
import InputDescription from '../inputs/InputDescription';
import PrimaryButton from '../PrimaryButton';
import { ToastContainer, toast } from 'react-toastify';

import { IEducationRequest } from '../../../ts/interfaces/IEducationRequest';

interface EducationRequestModalProps {
  request: IEducationRequest | null;
  onClose: () => void;
  onCancel: () => void;
  onChangeRequest: (request: IEducationRequest) => void;
}

interface EducationRequestFields {
  subject: string;
  description: string;
}

const EducationRequestModal: FC<EducationRequestModalProps> = ({
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
  } = useForm<EducationRequestFields>({
    mode: 'onBlur',
    defaultValues: {
      subject: request?.subject,
      description: request?.description,
    },
  });

  const [sendEducationRequest] = useSendEducationRequestMutation();
  const [updateEducationRequest] = useUpdateEducationRequestMutation();

  const onSubmit = async (data: EducationRequestFields) => {
    if (intensiveId) {
      if (!request) {
        const { data: responseData, error: responseError } =
          await sendEducationRequest({
            ...data,
            intensiveId: parseInt(intensiveId),
          });

        if (responseData) {
          onChangeRequest(responseData);
        }

        if (responseError) {
          toast('Произошла серверная ошибка при отправке запроса', {
            type: 'error',
          });
        }
      } else {
        const { data: responseData, error: responseError } =
          await updateEducationRequest({
            ...data,
            requestId: request.id,
          });

        if (responseData) {
          onChangeRequest(responseData);
        }

        if (responseError) {
          toast('Произошла серверная ошибка при обновлении запроса', {
            type: 'error',
          });
        }
      }
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />

      <Modal
        title={
          request
            ? 'Изменение образовательного запроса'
            : 'Отправка образовательного запроса'
        }
        onCloseModal={onClose}
      >
        <div>
          <InputDescription
            register={register}
            fieldName="subject"
            registerOptions={{
              required: 'Поле обязательно к заполнению',
              minLength: {
                value: 4,
                message: 'Минимальное количество символов - 4',
              },
              maxLength: {
                value: 50,
                message: 'Максимальное количество символов - 50',
              },
            }}
            placeholder="Тема запроса"
            errorMessage={
              typeof errors.subject?.message === 'string'
                ? errors.subject.message
                : ''
            }
          />

          <div className="mt-4">
            <InputDescription
              isTextArea={true}
              register={register}
              registerOptions={{
                maxLength: {
                  value: 500,
                  message: 'Максимальное количество символов - 500',
                },
              }}
              fieldName="description"
              placeholder="Описание запроса"
              errorMessage={
                typeof errors.description?.message === 'string'
                  ? errors.description.message
                  : ''
              }
            />
          </div>
        </div>

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
              children={request ? 'Изменить' : 'Отправить'}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EducationRequestModal;
