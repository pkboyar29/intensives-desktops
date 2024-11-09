import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import Modal from '../modals/Modal';
import InputDescription from '../inputs/InputDescription';
import PrimaryButton from '../PrimaryButton';

import {
  useCreateStageMutation,
  useUpdateStageMutation,
} from '../../redux/api/stageApi';

import { IStage } from '../../ts/interfaces/IStage';

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
    formState: { errors },
  } = useForm<StageFields>({
    mode: 'onBlur',
    defaultValues: {
      name: stage?.name,
      description: stage?.description,
      startDate: stage?.startDate.toISOString().split('T')[0],
      finishDate: stage?.finishDate.toISOString().split('T')[0],
    },
  });

  const [createStage] = useCreateStageMutation();
  const [updateStage] = useUpdateStageMutation();

  const onSubmit = async (data: StageFields) => {
    try {
      if (intensiveId) {
        if (!stage) {
          const { data: responseData } = await createStage({
            ...data,
            intensiveId: parseInt(intensiveId),
          });

          if (responseData) {
            onChangeStage(responseData);
          }
        } else {
          const { data: responseData } = await updateStage({
            ...data,
            id: stage.id,
            intensiveId: parseInt(intensiveId),
          });

          if (responseData) {
            onChangeStage(responseData);
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Modal
      title={stage ? 'Редактирование этапа' : 'Создание этапа'}
      onCloseModal={onClose}
    >
      <div>
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
            typeof errors.name?.message === 'string' ? errors.name.message : ''
          }
        />

        <div className="mt-4">
          <InputDescription
            isTextArea={true}
            register={register}
            registerOptions={{
              maxLength: {
                value: 200,
                message: 'Максимальное количество символов - 200',
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

        <div className="flex gap-5 mt-7">
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
  );
};

export default StageModal;
