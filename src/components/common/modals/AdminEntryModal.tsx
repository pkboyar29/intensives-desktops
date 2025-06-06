import { useEffect, useState } from 'react';

import { tableConfigs, TableType } from '../../../tableConfigs';
import Modal from './Modal';
import { ColumnConfig } from '../../../tableConfigs/nameConfig';
import RelatedKeysList from '../../RelatedKeysList';
import PrimaryButton from '../PrimaryButton';
import { validateTableFields } from '../../../helpers/tableHelpers';
import { ParentFields } from '../../../ts/types/types';

interface AdminEntityModalProps<T> {
  type: TableType;
  defaultParentFields?: ParentFields;
  entityParentId?: Record<string, string | number>;
  onClose: () => void;
  onCreate: (item: T) => void;
}

function AdminCreateEntityModal<T>(props: AdminEntityModalProps<T>) {
  const { type, defaultParentFields, entityParentId, onClose, onCreate } =
    props;

  const columns = tableConfigs[type] as ColumnConfig<T>[];
  const [creatingRow, setCreatingRow] = useState<T>({} as T);

  useEffect(() => {
    setDefaultValues();
  }, []);

  useEffect(() => {
    //console.log(creatingRow);
  }, [creatingRow]);

  const setDefaultValues = () => {
    columns.forEach((column) => {
      const defaultParentField =
        defaultParentFields && defaultParentFields[column.key as string];
      if (defaultParentField) {
        setCreatingRow((prev) => ({
          ...prev,
          [column.key as keyof T]: defaultParentField.id,
        }));
      }
    });
  };

  //console.log(defaultParentFields);

  return (
    <>
      <Modal
        title={'Создание записи'}
        onCloseModal={() => onClose()}
        closeByClickOutside={false}
      >
        <div className="px-2 py-2 space-y-4">
          {columns.map((column) => {
            if (column.readOnly || column.type === 'action') return;

            let inputElement;
            switch (column.type) {
              case 'string':
                inputElement = (
                  <input
                    className="border border-black"
                    onChange={(e) => {
                      setCreatingRow((prev) => ({
                        ...prev,
                        [column.key as keyof T]: e.target.value,
                      }));
                    }}
                  ></input>
                );
                break;
              case 'number':
                inputElement = (
                  <input
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="border border-black"
                    onChange={(e) => {
                      setCreatingRow((prev) => ({
                        ...prev,
                        [column.key as keyof T]: e.target.value,
                      }));
                    }}
                  ></input>
                );
                break;
              case 'boolean':
                inputElement = (
                  <input
                    type="checkbox"
                    className="border border-black"
                    onChange={(e) => {
                      setCreatingRow((prev) => ({
                        ...prev,
                        [column.key as keyof T]: e.target.checked,
                      }));
                    }}
                  ></input>
                );
                break;
              case 'date':
                inputElement = (
                  <input
                    type="date"
                    className="border border-black"
                    onChange={(e) => {
                      setCreatingRow((prev) => ({
                        ...prev,
                        [column.key as keyof T]: e.target.value,
                      }));
                    }}
                  ></input>
                );
                break;
              case 'relation':
                inputElement = (
                  <div className="">
                    <RelatedKeysList
                      entity={type}
                      defaultValue={
                        defaultParentFields &&
                        defaultParentFields[column.key as string]?.name
                      }
                      entityParentId={
                        defaultParentFields &&
                        defaultParentFields[column.key as string]?.grandparentId
                      }
                      parentKey={
                        column.adaptedKeyName
                          ? column.adaptedKeyName
                          : column.key.toString()
                      }
                      onChange={(parentEntity) => {
                        setCreatingRow((prev) => ({
                          ...prev,
                          [column.key as keyof T]: parentEntity
                            ? parentEntity.id
                            : undefined,
                        }));
                      }}
                    />
                  </div>
                );
                break;
            }

            return (
              <div className="flex items-center space-x-3" key={column.label}>
                <label className="w-32 font-sans text-base font-normal text-right text-black">
                  {column.label}:
                </label>
                <div className="flex-1">{inputElement}</div>
              </div>
            );
          })}

          <div className="flex mt-5 space-x-10">
            <PrimaryButton clickHandler={() => onClose()} buttonColor={'gray'}>
              Отмена{' '}
            </PrimaryButton>
            <PrimaryButton
              clickHandler={() => {
                if (validateTableFields<T>(columns, creatingRow)) {
                  onCreate(creatingRow);
                }
              }}
            >
              Создать{' '}
            </PrimaryButton>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default AdminCreateEntityModal;
