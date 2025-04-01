import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { useAppSelector } from '../../redux/store';

import {
  useCreateIntensiveMutation,
  useUpdateIntensiveMutation,
} from '../../redux/api/intensiveApi';
import { useGetFlowsQuery } from '../../redux/api/flowApi';
import { useGetTeachersInUniversityQuery } from '../../redux/api/teacherApi';
import { useGetStudentRolesQuery } from '../../redux/api/studentRoleApi';
import { useUploadFilesMutation } from '../../redux/api/fileApi';
import { useFileHandler } from '../../helpers/useFileHandler';

import { getISODateInUTC3 } from '../../helpers/dateHelpers';
import { getUniqueFiles, uploadAllFiles } from '../../helpers/fileHelpers';

import Title from '../common/Title';
import PrimaryButton from '../common/PrimaryButton';
import InputDescription from '../common/inputs/InputDescription';
import MultipleSelectInput from '../common/inputs/MultipleSelectInput';
import SpecificStudentsInput from '../common/inputs/SpecificStudentsInput';
import FileUpload from '../common/inputs/FileInput';
import Modal from '../common/modals/Modal';
import { ToastContainer, toast } from 'react-toastify';
import EditableFileList from '../EditableFileList';

import { IFile, INewFileObject } from '../../ts/interfaces/IFile';

interface Item {
  id: number;
  name: string;
}

interface ManageIntensiveFields {
  name: string;
  description: string;
  openDate: string;
  closeDate: string;
  flows: Item[];
  specificStudents: Item[];
  teachers: Item[];
  roles: Item[];
  files?: IFile[];
}

const ManageIntensiveForm: FC = () => {
  const { intensiveId } = useParams();
  const currentIntensive = useAppSelector((state) => state.intensive.data);

  const navigate = useNavigate();

  const [cancelModal, setCancelModal] = useState<boolean>(false);
  const [successfulSaveModal, setSuccessfulSaveModal] = useState<{
    status: boolean;
    intensiveId: number | null;
  }>({
    status: false,
    intensiveId: null,
  });

  const [createIntensive] = useCreateIntensiveMutation();
  const [updateIntensive] = useUpdateIntensiveMutation();
  const [uploadFiles] = useUploadFilesMutation();

  // TODO: получать от конкретного университета
  const { data: flows } = useGetFlowsQuery();
  // TODO: получать от конкретного университета
  const { data: teachers } = useGetTeachersInUniversityQuery();
  const { data: studentRoles } = useGetStudentRolesQuery();

  const {
    attachedFilesList,
    newFiles,
    handleFilesChange,
    setAttachedFilesList,
    setNewFiles,
    handleFileDelete,
  } = useFileHandler();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    watch,
    formState: { errors },
  } = useForm<ManageIntensiveFields>({
    mode: 'onBlur',
  });

  useEffect(() => {
    if (intensiveId && currentIntensive) {
      reset({
        name: currentIntensive.name,
        description: currentIntensive.description,
        openDate: getISODateInUTC3(currentIntensive.openDate),
        closeDate: getISODateInUTC3(currentIntensive.closeDate),
        flows: currentIntensive.flows,
        specificStudents: currentIntensive.specificStudents.map((student) => ({
          id: student.id,
          name: student.nameWithGroup,
        })),
        teachers: currentIntensive.teachers,
        roles: currentIntensive.roles,
      });

      // Записываем в отображаемый список файлов реальный текущий список
      if (attachedFilesList.length === 0) {
        setAttachedFilesList((prevFiles) => [
          ...prevFiles,
          ...currentIntensive.files,
        ]);
      }
    }
  }, [intensiveId, currentIntensive]);

  const handleResponseError = (error: FetchBaseQueryError) => {
    const errorData = (error as FetchBaseQueryError).data as {
      specific_student_ids?: string[];
    };
    if (errorData && errorData.specific_student_ids) {
      setError('specificStudents', {
        type: 'custom',
        message: errorData.specific_student_ids[0],
      });
    } else {
      if (currentIntensive) {
        toast('Произошла серверная ошибка при сохранении изменений', {
          type: 'error',
        });
      } else {
        toast('Произошла серверная ошибка при создании', {
          type: 'error',
        });
      }
    }
  };

  const onSubmit = async (data: ManageIntensiveFields) => {
    if (!data.flows || data.flows.length === 0) {
      setError('flows', {
        type: 'custom',
        message: 'Необходимо выбрать как минимум один поток',
      });
      return;
    }
    if (!data.teachers || data.teachers.length === 0) {
      setError('teachers', {
        type: 'custom',
        message: 'Необходимо выбрать как минимум одного преподавателя',
      });
      return;
    }

    const flowIds: number[] = data.flows.map((flow) => flow.id);
    const specificStudentsIds: number[] = data.specificStudents
      ? data.specificStudents.map((student) => student.id)
      : [];
    const teacherIds: number[] = data.teachers.map((teacher) => teacher.id);
    const roleIds: number[] = data.roles
      ? data.roles.map((role) => role.id)
      : [];
    const fileIds: number[] = attachedFilesList
      ? attachedFilesList
          .filter((file) => file.id > 0)
          .map((file: IFile) => file.id)
      : [];

    let responseData;
    let responseError;

    if (intensiveId) {
      ({ data: responseData, error: responseError } = await updateIntensive({
        id: Number(intensiveId),
        ...data,
        flowIds,
        specificStudentsIds,
        teacherIds,
        roleIds,
        isOpen: true,
        fileIds: fileIds,
      }));

      if (responseError) {
        handleResponseError(responseError as FetchBaseQueryError);
        return;
      }
    } else {
      ({ data: responseData, error: responseError } = await createIntensive({
        ...data,
        flowIds,
        specificStudentsIds,
        teacherIds,
        roleIds,
        isOpen: true,
      }));

      if (responseError) {
        handleResponseError(responseError as FetchBaseQueryError);
        return;
      }

      //intensiveId = responseData?.id; Нужно делать что то типо такого

      toast('Интенсив успешно создан', {
        type: 'success',
      });
    }

    if (responseData && newFiles) {
      // Загрузка файлов после успешного создания/обновления интенсива
      const { success, errors } = await uploadAllFiles(
        uploadFiles,
        'intensives',
        Number(responseData.id || intensiveId),
        newFiles
      );

      if (errors === 0) {
        setSuccessfulSaveModal({
          status: true,
          intensiveId: Number(responseData.id || intensiveId),
        });
      }
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />

      {cancelModal && (
        <Modal
          title="Вы уверены, что хотите прекратить редактирование?"
          onCloseModal={() => setCancelModal(false)}
        >
          <p className="text-lg text-bright_gray">
            Вы уверены, что хотите прекратить редактирование? Все сделанные вами
            изменения не будут сохранены.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <div>
              <PrimaryButton
                buttonColor="gray"
                clickHandler={() => setCancelModal(false)}
                children="Продолжить редактирование"
              />
            </div>
            <div>
              <PrimaryButton
                clickHandler={() => {
                  setCancelModal(false);
                  if (intensiveId) {
                    navigate(`/intensives/${intensiveId}/overview`);
                  } else {
                    navigate(`/intensives`);
                  }
                }}
                children="Отменить"
              />
            </div>
          </div>
        </Modal>
      )}

      {successfulSaveModal.status && (
        <Modal
          title={`Интенсив был успешно ${intensiveId ? 'изменен' : 'создан'}`}
          onCloseModal={() => {
            navigate(`/intensives/${successfulSaveModal.intensiveId}/overview`);
            setSuccessfulSaveModal({
              status: false,
              intensiveId: null,
            });
          }}
        >
          <p className="text-lg text-bright_gray">
            {`Интенсив был успешно ${intensiveId ? 'изменен' : 'создан'}`}
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <div>
              <PrimaryButton
                clickHandler={() => {
                  navigate(
                    `/intensives/${successfulSaveModal.intensiveId}/overview`
                  );
                  setSuccessfulSaveModal({
                    status: false,
                    intensiveId: null,
                  });
                }}
                children="Закрыть"
              />
            </div>
          </div>
        </Modal>
      )}

      <div
        className={`flex justify-center ${
          !intensiveId ? `pt-[88px]` : `max-w-[1280px]`
        }`}
      >
        <form
          className="max-w-[765px] w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
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
              <Controller
                name="flows"
                control={control}
                render={({ field }) => (
                  <div className="mt-3">
                    <MultipleSelectInput
                      description="Список потоков"
                      errorMessage={
                        typeof errors.flows?.message === 'string'
                          ? errors.flows.message
                          : ''
                      }
                      items={flows}
                      selectedItems={field.value || []}
                      setSelectedItems={field.onChange}
                      chipSize="big"
                    />
                  </div>
                )}
              />
            )}

            <Controller
              name="specificStudents"
              control={control}
              render={({ field }) => (
                <div className="mt-3">
                  <SpecificStudentsInput
                    selectedItems={field.value || []}
                    setSelectedItems={field.onChange}
                    flowsToExclude={
                      watch('flows')
                        ? watch('flows').map((flow) => flow.id)
                        : []
                    }
                    errorMessage={
                      typeof errors.specificStudents?.message === 'string'
                        ? errors.specificStudents.message
                        : ''
                    }
                  />
                </div>
              )}
            />

            {teachers && (
              <Controller
                name="teachers"
                control={control}
                render={({ field }) => (
                  <div className="mt-3">
                    <MultipleSelectInput
                      description="Список преподавателей"
                      errorMessage={
                        typeof errors.teachers?.message === 'string'
                          ? errors.teachers.message
                          : ''
                      }
                      items={teachers}
                      selectedItems={field.value || []}
                      setSelectedItems={field.onChange}
                    />
                  </div>
                )}
              />
            )}

            {studentRoles && (
              <Controller
                name="roles"
                control={control}
                render={({ field }) => (
                  <div className="mt-3">
                    <MultipleSelectInput
                      description="Список ролей для студентов"
                      errorMessage={
                        typeof errors.roles?.message === 'string'
                          ? errors.roles.message
                          : ''
                      }
                      items={studentRoles}
                      selectedItems={field.value || []}
                      setSelectedItems={field.onChange}
                    />
                  </div>
                )}
              />
            )}
          </div>

          <div className="p-4 mx-auto my-3 bg-white rounded-lg shadow-md max-w">
            <div className="text-lg font-bold">Файлы для студентов</div>
            {attachedFilesList && (
              <EditableFileList
                files={attachedFilesList}
                onFileDelete={handleFileDelete}
              />
            )}
            <FileUpload onFilesChange={handleFilesChange} />
          </div>

          <div className="flex my-5 gap-7">
            <PrimaryButton
              buttonColor="gray"
              type="button"
              children="Отмена"
              clickHandler={() => {
                setCancelModal(true);
              }}
            />

            <PrimaryButton
              type="submit"
              children={
                intensiveId ? 'Редактировать интенсив' : 'Создать интенсив'
              }
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default ManageIntensiveForm;
