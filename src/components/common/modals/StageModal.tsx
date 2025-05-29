import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import Modal from '../modals/Modal';
import InputDescription from '../inputs/InputDescription';
import PrimaryButton from '../PrimaryButton';
import { ToastContainer, toast } from 'react-toastify';

import {
  useCreateStageMutation,
  useUpdateStageMutation,
} from '../../../redux/api/stageApi';

import { getISODateInUTC3 } from '../../../helpers/dateHelpers';

import { IStage } from '../../../ts/interfaces/IStage';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

interface StageModalProps {
  stage: IStage | null;
  onClose: () => void;
  onCancel: () => void;
  onChangeStage: (stage: IStage) => void;
}

interface StageFields {
  name: string;
  description: string;
  startDate: string;
  finishDate: string;
}

const StageModal: FC<StageModalProps> = ({
  stage,
  onClose,
  onCancel,
  onChangeStage,
}) => {
  const { intensiveId } = useParams();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<StageFields>({
    mode: 'onBlur',
    defaultValues: {
      name: stage?.name,
      description: stage?.description,
      startDate: stage ? getISODateInUTC3(stage.startDate) : '',
      finishDate: stage ? getISODateInUTC3(stage.finishDate) : '',
    },
  });

  const [createStage] = useCreateStageMutation();
  const [updateStage] = useUpdateStageMutation();

  const onSubmit = async (data: StageFields) => {
    if (intensiveId) {
      if (!stage) {
        const { data: responseData, error: responseError } = await createStage({
          ...data,
          intensiveId: parseInt(intensiveId),
        });

        if (responseData) {
          onChangeStage(responseData);
        }

        if (responseError) {
          handleResponseError(responseError as FetchBaseQueryError);
        }
      } else {
        const { data: responseData, error: responseError } = await updateStage({
          ...data,
          id: stage.id,
          intensiveId: parseInt(intensiveId),
        });

        if (responseData) {
          onChangeStage(responseData);
        }

        if (responseError) {
          handleResponseError(responseError as FetchBaseQueryError);
        }
      }
    }
  };

  const handleResponseError = (error: FetchBaseQueryError) => {
    const errorData = error.data as {
      start_dt?: string[];
      finish_dt?: string[];
    };
    if (errorData.start_dt) {
      setError('startDate', {
        type: 'custom',
        message: errorData.start_dt[0],
      });
    } else if (errorData.finish_dt) {
      setError('finishDate', {
        type: 'custom',
        message: errorData.finish_dt[0],
      });
    } else {
      toast('Произошла серверная ошибка при создании этапа', {
        type: 'error',
      });
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />

      <Modal
        title={stage ? 'Редактирование этапа' : 'Создание этапа'}
        onCloseModal={onClose}
      >
        <div className="w-full">
          <InputDescription
            register={register}
            fieldName="name"
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
            placeholder="Название этапа"
            errorMessage={
              typeof errors.name?.message === 'string'
                ? errors.name.message
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
              placeholder="Описание этапа"
              errorMessage={
                typeof errors.description?.message === 'string'
                  ? errors.description.message
                  : ''
              }
            />
          </div>

          <div className="flex flex-col w-full gap-5 mt-3 md:flex-row md:mt-7">
            <InputDescription
              register={register}
              fieldName="startDate"
              registerOptions={{
                required: 'Поле обязательно',
              }}
              placeholder="Дата начала"
              description="Выберите дату начала"
              type="date"
              errorMessage={
                typeof errors.startDate?.message === 'string'
                  ? errors.startDate.message
                  : ''
              }
            />

            <InputDescription
              register={register}
              fieldName="finishDate"
              registerOptions={{
                required: 'Поле обязательно',
                validate: {
                  lessThanStartDate: (value: string, formValues) =>
                    new Date(value) > new Date(formValues.startDate) ||
                    'Дата окончания должна быть позже даты начала',
                },
              }}
              placeholder="Дата окончания"
              description="Выберите дату окончания"
              type="date"
              errorMessage={
                typeof errors.finishDate?.message === 'string'
                  ? errors.finishDate.message
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
              children={stage ? 'Редактировать' : 'Создать'}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default StageModal;
