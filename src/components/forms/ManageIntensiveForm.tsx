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
import { uploadAllFiles } from '../../helpers/fileHelpers';

import { Helmet } from 'react-helmet-async';
import Title from '../common/Title';
import PrimaryButton from '../common/PrimaryButton';
import InputDescription from '../common/inputs/InputDescription';
import MultipleSelectInput from '../common/inputs/MultipleSelectInput';
import SpecificStudentsInput from '../common/inputs/SpecificStudentsInput';
import FileUpload from '../common/inputs/FileInput';
import Modal from '../common/modals/Modal';
import { ToastContainer, toast } from 'react-toastify';
import EditableFileList from '../EditableFileList';

import { IFile } from '../../ts/interfaces/IFile';

interface ManageIntensiveFields {
  name: string;
  description: string;
  openDate: string;
  closeDate: string;
  flows: number[];
  specificStudents: {
    id: number;
    name: string;
  }[];
  teachers: number[];
  managers: number[];
  roles: number[];
  files?: IFile[];
  isOpen: boolean;
}

const ManageIntensiveForm: FC = () => {
  const { intensiveId } = useParams();
  const currentIntensive = useAppSelector((state) => state.intensive.data);
  const currentUser = useAppSelector((state) => state.user.data);

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
  const { data: flows } = useGetFlowsQuery({});
  const { data: teachers } = useGetTeachersInUniversityQuery({});
  const { data: managers } = useGetTeachersInUniversityQuery({
    isManager: true,
  });
  const { data: studentRoles } = useGetStudentRolesQuery({});

  const displayManagersInput =
    !intensiveId ||
    (intensiveId && currentIntensive?.creatorId == currentUser?.id);

  const {
    attachedFilesList,
    newFiles,
    handleFilesChange,
    setAttachedFilesList,
    handleFileDelete,
  } = useFileHandler();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    clearErrors,
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
        flows: currentIntensive.flows.map((flow) => flow.id),
        specificStudents: currentIntensive.specificStudents.map((student) => ({
          id: student.id,
          name: student.nameWithGroup,
        })),
        teachers: currentIntensive.teachers.map((teacher) => teacher.id),
        managers: currentIntensive.managers.map((manager) => manager.id),
        roles: currentIntensive.roles.map((role) => role.id),
        isOpen: currentIntensive.isOpen,
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

  useEffect(() => {
    if (!intensiveId && currentUser) {
      reset({
        managers: [currentUser.id],
      });
    }
  }, [intensiveId, currentUser]);

  const openDate = watch('openDate');
  const closeDate = watch('closeDate');
  useEffect(() => {
    if (!openDate || !closeDate) {
      return;
    }
    clearErrors('openDate');
  }, [openDate, closeDate]);

  const handleResponseError = (error: FetchBaseQueryError) => {
    const errorData = error.data as {
      open_dt?: string[];
      close_dt?: string[];
      specific_student_ids?: string[];
    };
    if (errorData && errorData.open_dt) {
      setError('openDate', { type: 'custom', message: errorData.open_dt[0] });
    } else if (errorData && errorData.close_dt) {
      setError('closeDate', { type: 'custom', message: errorData.close_dt[0] });
    } else if (errorData && errorData.specific_student_ids) {
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

    const specificStudentsIds: number[] = data.specificStudents
      ? data.specificStudents.map((student) => student.id)
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
        flowIds: data.flows,
        specificStudentsIds,
        teacherIds: data.teachers,
        managerIds: data.managers,
        roleIds: data.roles,
        fileIds: fileIds,
      }));

      if (responseError) {
        handleResponseError(responseError as FetchBaseQueryError);
        return;
      }
    } else {
      ({ data: responseData, error: responseError } = await createIntensive({
        ...data,
        flowIds: data.flows,
        specificStudentsIds,
        teacherIds: data.teachers,
        managerIds: data.managers,
        roleIds: data.roles,
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
      <Helmet>
        <title>
          {intensiveId
            ? currentIntensive &&
              `Редактирование интенсива | ${currentIntensive.name}`
            : 'Создание интенсива'}
        </title>
      </Helmet>

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
          <div className="flex flex-col justify-end gap-3 mt-3 md:flex-row md:mt-6">
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
          !intensiveId ? `pt-[88px] px-3` : `max-w-[1280px]`
        }`}
      >
        <form
          className="max-w-[765px] w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Title
            text={intensiveId ? 'Редактировать интенсив' : 'Создать интенсив'}
          />

          <div className="flex flex-col gap-1.5 sm:gap-3 mt-3 mb-3 sm:mt-6">
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

            <div className="flex flex-col justify-between w-full gap-3 sm:flex-row sm:gap-6">
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
                      items={flows.results}
                      selectedItemIds={field.value || []}
                      disabledItemIds={currentIntensive?.flows.map((f) => f.id)}
                      setSelectedItemIds={field.onChange}
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
                    flowsToExclude={watch('flows') ? watch('flows') : []}
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
                      selectedItemIds={field.value || []}
                      setSelectedItemIds={field.onChange}
                    />
                  </div>
                )}
              />
            )}

            {managers && currentUser && displayManagersInput && (
              <Controller
                name="managers"
                control={control}
                render={({ field }) => (
                  <div className="mt-3">
                    <MultipleSelectInput
                      description="Список организаторов"
                      errorMessage={
                        typeof errors.managers?.message === 'string'
                          ? errors.managers.message
                          : ''
                      }
                      items={managers.map((manager) => {
                        if (manager.id == currentUser.id) {
                          return {
                            id: manager.id,
                            name: `${manager.name} (Вы)`,
                          };
                        } else {
                          return manager;
                        }
                      })}
                      selectedItemIds={field.value || []}
                      setSelectedItemIds={field.onChange}
                      disabledItemIds={[currentUser.id]}
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
                      items={studentRoles.results}
                      selectedItemIds={field.value || []}
                      setSelectedItemIds={field.onChange}
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

          {Object.keys(errors).length > 0 && (
            <div className="text-base text-center text-red sm:text-left">
              Форма содержит ошибки
            </div>
          )}

          <div className="flex flex-col gap-3 my-5 sm:flex-row mt:gap-7">
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
