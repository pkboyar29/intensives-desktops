import { FC, ReactNode, useEffect, useRef, useState } from 'react';

import CrossIcon from '../../icons/CrossIcon';
import { tableConfigs, TableType } from '../../../tableConfigs';
import Modal from './Modal';
import { ColumnConfig } from '../../../tableConfigs/nameConfig';
import RelatedKeysList from '../../RelatedKeysList';
import PrimaryButton from '../PrimaryButton';
import { toast, ToastContainer } from 'react-toastify';
import { validateTableFields } from '../../../helpers/tableHelpers';
import { ParentFields } from '../../../ts/types/types';
import { IUploadXlsxError } from '../../../ts/interfaces/IUser';

interface AdminUploadXlsxHelpModalProps {
  onClose: () => void;
}

const AdminUploadXlsxHelpModal: FC<AdminUploadXlsxHelpModalProps> = ({
  onClose,
}) => {
  return (
    <>
      <Modal
        title={'Информация о структуре .xlsx'}
        onCloseModal={() => onClose()}
      >
        <label>Пример:</label>
        <div className="mt-2">
          <div className="flex px-1 py-2 pb-1 font-semibold border-b">
            <p className="w-1/4">Фамилия</p>
            <p className="w-1/4">Имя</p>
            <p className="w-1/3">Отчество</p>
            <p className="w-1/3">Email</p>
          </div>
          <div className="flex px-2 py-3 text-left">
            <p className="w-1/4">Иванов</p>
            <p className="w-1/4">Иван</p>
            <p className="w-1/3">Иванович</p>
            <p className="w-1/3">ivanov@student.ru</p>
          </div>
          <hr />
          <div className="flex px-2 py-3 text-left">
            <p className="w-1/4">Артемов</p>
            <p className="w-1/4">Артем</p>
            <p className="w-1/3">Артемович</p>
            <p className="w-1/3">artemov@student.ru</p>
          </div>
          <hr />
          <p className="flex px-2 py-3 text-left">. . .</p>
        </div>
        <p className="mt-3">Названия столбцов в файле не указываются</p>
      </Modal>
    </>
  );
};

export default AdminUploadXlsxHelpModal;
