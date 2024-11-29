import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { useAppSelector } from '../../redux/store';

import {
  useCreateIntensiveMutation,
  useUpdateIntensiveMutation,
} from '../../redux/api/intensiveApi';
import { useGetFlowsQuery } from '../../redux/api/flowApi';
import { useGetTeachersInUniversityQuery } from '../../redux/api/teacherApi';

import { getISODateInUTC3 } from '../../helpers/dateHelpers';

import Title from '../Title';
import PrimaryButton from '../PrimaryButton';
import InputDescription from '../inputs/InputDescription';
import MultipleSelectInput from '../inputs/MultipleSelectInput';
import FileUpload from '../inputs/FileInput';

import { IFlow } from '../../ts/interfaces/IFlow';
import { ITeacher } from '../../ts/interfaces/ITeacher';

// add flows/teachers/roles using Controller
interface ManageIntensiveFields {
  name: string;
  description: string;
  openDate: string;
  closeDate: string;
}

const ManageIntensiveForm: FC = () => {
  const { intensiveId } = useParams();
  const navigate = useNavigate();

  const [createIntensive] = useCreateIntensiveMutation();
  const [updateIntensive] = useUpdateIntensiveMutation();

  const currentIntensive = useAppSelector((state) => state.intensive.data);

  const { data: flows } = useGetFlowsQuery();
  const [selectedFlows, setSelectedFlows] = useState<IFlow[]>([]);
  const [flowsErrorMessage, setFlowsErrorMessage] = useState<string>('');

  const { data: teachers } = useGetTeachersInUniversityQuery();
  const [selectedTeachers, setSelectedTeachers] = useState<ITeacher[]>([]);
  const [teachersErrorMessage, setTeachersErrorMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ManageIntensiveFields>({
    mode: 'onBlur',
  });

  // TODO: start using reset instead of setValue
  useEffect(() => {
    if (intensiveId && currentIntensive) {
      setValue('name', currentIntensive.name);
      setValue('description', currentIntensive.description);
      console.log(getISODateInUTC3(currentIntensive.openDate));
      console.log(getISODateInUTC3(currentIntensive.closeDate));
      setValue('openDate', getISODateInUTC3(currentIntensive.openDate));
      setValue('closeDate', getISODateInUTC3(currentIntensive.closeDate));

      setSelectedFlows(currentIntensive.flows);
      setSelectedTeachers(currentIntensive.teachers);
    }
  }, [intensiveId, currentIntensive]);

  const onSubmit = async (data: ManageIntensiveFields) => {
    try {
      if (selectedFlows.length === 0) {
        setFlowsErrorMessage('Необходимо выбрать хотя бы один поток!');
        return;
      } else {
        setFlowsErrorMessage('');
      }

      if (selectedTeachers.length === 0) {
        setTeachersErrorMessage(
          'Необходимо выбрать хотя бы одного преподавателя!'
        );
        return;
      } else {
        setTeachersErrorMessage('');
      }

      const flowIds: number[] = selectedFlows.map((flow) => flow.id);
      const teacherIds: number[] = selectedTeachers.map(
        (teacher) => teacher.id
      );

      if (intensiveId) {
        await updateIntensive({
          id: Number(intensiveId),
          ...data,
          flowIds,
          teacherIds,
          roleIds: [],
          universityId: 1,
          isOpen: true,
        });

        navigate(`/manager/${intensiveId}/overview`);
      } else {
        const { data: createIntensiveResponseData } = await createIntensive({
          ...data,
          flowIds,
          teacherIds,
          roleIds: [],
          universityId: 1,
          isOpen: true,
        });

        if (createIntensiveResponseData) {
          navigate(`/manager/${createIntensiveResponseData.id}/overview`);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex justify-center pt-5">
      <form className="max-w-[765px] w-full" onSubmit={handleSubmit(onSubmit)}>
        <Title
          text={intensiveId ? 'Редактировать интенсив' : 'Создать интенсив'}
        />

        <div className="flex flex-col gap-3 mt-6 mb-3">
          <div className="text-lg font-bold">Интенсив</div>

          <InputDescription
            fieldName="name"
            register={register}
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
            description="Название интенсива"
            placeholder="Название интенсива"
            errorMessage={
              typeof errors.name?.message === 'string'
                ? errors.name.message
                : ''
            }
          />

          <InputDescription
            isTextArea={true}
            fieldName="description"
            register={register}
            registerOptions={{
              maxLength: {
                value: 500,
                message: 'Максимальное количество символов - 500',
              },
            }}
            description="Описание интенсива"
            placeholder="Описание интенсива"
            errorMessage={
              typeof errors.description?.message === 'string'
                ? errors.description.message
                : ''
            }
          />
        </div>

        <div className="flex flex-col gap-3 my-3">
          <div className="text-lg font-bold">Время проведения</div>

          <div className="flex justify-between gap-6">
            <InputDescription
              fieldName="openDate"
              register={register}
              registerOptions={{
                required: 'Поле обязательно',
              }}
              type="date"
              description="Дата начала"
              placeholder="Дата начала"
              errorMessage={
                typeof errors.openDate?.message === 'string'
                  ? errors.openDate.message
                  : ''
              }
            />

            <InputDescription
              fieldName="closeDate"
              register={register}
              registerOptions={{
                required: 'Поле обязательно',
                validate: {
                  lessThanOpenDt: (value: string, formValues) =>
                    new Date(value) > new Date(formValues.openDate) ||
                    'Дата окончания должна быть позже даты начала',
                },
              }}
              type="date"
              description="Дата окончания"
              placeholder="Дата окончания"
              errorMessage={
                typeof errors.closeDate?.message === 'string'
                  ? errors.closeDate.message
                  : ''
              }
            />
          </div>
        </div>

        <div className="my-3">
          <div className="text-lg font-bold">Участники</div>

          {flows && (
            <div className="mt-3">
              <MultipleSelectInput
                description="Список потоков"
                errorMessage={flowsErrorMessage}
                setErrorMessage={setFlowsErrorMessage}
                items={flows}
                selectedItems={selectedFlows}
                setSelectedItems={setSelectedFlows}
              />
            </div>
          )}

          {teachers && (
            <div className="mt-3">
              <MultipleSelectInput
                description="Список преподавателей"
                errorMessage={teachersErrorMessage}
                setErrorMessage={setTeachersErrorMessage}
                items={teachers}
                selectedItems={selectedTeachers}
                setSelectedItems={setSelectedTeachers}
              />
            </div>
          )}
        </div>

        <div className="my-3">
          <FileUpload />
        </div>

        <div className="my-5">
          <PrimaryButton
            type="submit"
            children={
              intensiveId ? `Редактировать интенсив` : `Создать интенсив`
            }
          />
        </div>
      </form>
    </div>
  );
};

export default ManageIntensiveForm;
