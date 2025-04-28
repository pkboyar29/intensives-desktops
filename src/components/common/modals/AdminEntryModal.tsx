import { FC, ReactNode, useEffect, useRef } from 'react';

import CrossIcon from '../../icons/CrossIcon';
import { tableConfigs, TableType } from '../../../tableConfigs';
import Modal from './Modal';
import { ColumnConfig } from '../../../tableConfigs/nameConfig';
import RelatedKeysList from '../../RelatedKeysList';

interface AdminEntryModalProps<T> {
  entry?: T;
  type: TableType;
  onCloseModal: () => void;
  onChangeEntry: (item: T) => void;
}

function AdminEntryModal<T>(props: AdminEntryModalProps<T>) {
  const { entry, type, onCloseModal, onChangeEntry } = props;

  const columns = tableConfigs[type] as ColumnConfig<T>[];

  return (
    <Modal title={'Создание записи'} onCloseModal={() => onCloseModal()}>
      <div>
        {columns.map((column) => {
          if (column.readOnly) return;

          let inputElement;
          switch (column.type) {
            case 'string':
              inputElement = (
                <input
                  className="border border-black"
                  onChange={(e) => {}}
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
                ></input>
              );
              break;
            case 'boolean':
              inputElement = <input type="checkbox"></input>;
              break;
            case 'date':
              inputElement = <input type="date"></input>;
              break;
            case 'relation':
              /*
              inputElement = (
                <RelatedKeysList
                  entity={type}
                  entityId={getId(info.row.original)}
                  parent={column.key.toString()}
                  defaultValue={value}
                  onChange={(newParentId, newParentName) => {
                    console.log(key);
                    if (editingRow.current) {
                      editingRow.current = {
                        ...editingRow.current,
                        [key as keyof T]: {
                          id: newParentId,
                          [column.renderKey as string]: newParentName,
                        },
                      };
                    }
                  }}
                />
              );
              */
              break;
          }

          return (
            <div className="flex items-center justify-center space-x-3">
              <p className="font-sans text-base font-normal text-black">
                {column.label}
              </p>
              {inputElement}
            </div>
          );
        })}
        <div className="flex justify-around mt-5">
          <button className="px-3 py-3 font-medium text-white duration-100 rounded-md bg-red hover:bg-dark_red">
            Отмена
          </button>
          <button className="px-3 py-3 font-medium text-white duration-100 rounded-md bg-blue hover:bg-dark_blue">
            Создать
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default AdminEntryModal;
