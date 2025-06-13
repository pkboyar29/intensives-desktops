import { FC } from 'react';

import Modal from './Modal';
import { IUploadXlsxError } from '../../../ts/interfaces/IUser';

interface AdminUploadXlsxModalProps {
  errors: IUploadXlsxError[];
  onClose: () => void;
}

const AdminUploadXlsxModal: FC<AdminUploadXlsxModalProps> = ({
  errors,
  onClose,
}) => {
  return (
    <>
      <Modal
        title={'Отчет загрузки .xlsx'}
        onCloseModal={() => onClose()}
        closeByClickOutside={false}
      >
        <div className="overflow-y-auto max-h-[500px]">
          <div className="flex px-1 py-2 pb-1 font-semibold border-b">
            <p className="w-1/6">Строка</p>
            <p className="flex-1">Описание ошибки</p>
          </div>
          {errors.map((error) => (
            <div key={error.rowId}>
              <div className="flex px-2 py-3 text-left">
                <p className="w-1/6 font-semibold">{error.rowId}</p>
                <p className="flex-1 break-words">{error.errorInfo}</p>
              </div>
              <hr />
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default AdminUploadXlsxModal;
