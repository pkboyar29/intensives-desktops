import { useState, FC } from 'react';

interface ChooseModalProps {
  itemsProp: any[];
  selectedItemsProp: any[];
  onClose: () => void;
  onSave: (newSelectedItems: any[], newItemsToChoose: any[]) => void;
}

const ChooseModal: FC<ChooseModalProps> = ({
  itemsProp,
  selectedItemsProp,
  onClose,
  onSave,
}) => {
  const [items, setitems] = useState(itemsProp);
  const [selectedItems, setSelectedItems] = useState(selectedItemsProp);

  const addItem = (newItem: any) => {
    setSelectedItems([...selectedItems, newItem]);
    setitems(items.filter((item) => item.id != newItem.id));
  };

  const deleteItem = (itemToDelete: any) => {
    setSelectedItems(
      selectedItems.filter((item: any) => item.id != itemToDelete.id)
    );
    setitems([...items, itemToDelete]);
  };

  const closeButtonClickHandler = () => {
    onClose();
  };

  const saveButtonClickHandler = () => {
    onSave(selectedItems, items);
    onClose();
  };

  return (
    <div className="fixed top-1/2 left-1/2 z-10 w-[100vw] h-[100vh] bg-[rgba(0,0,0,0.28)] transform -translate-x-1/2 -translate-y-1/2">
      <div className="p-8 top-1/2 left-1/2 bg-white rounded-sm z-12 relative w-[70vw] h-max transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex justify-between">
          <div className="text-lg">Выберите элементы</div>
          <button onClick={closeButtonClickHandler}>Закрыть</button>
        </div>

        <input
          type="text"
          placeholder="Поиск"
          className="w-full py-3 px-4 mt-3 bg-[#f0f2f5] rounded-xl"
        />

        <div className="mt-3 w-full h-full rounded-lg overflow-y-auto overflow-x-clip gap-1.5 flex flex-wrap p-2.5 border border-dashed border-[#637087]">
          {items.map((elem, index: number) => (
            <div
              key={index}
              onClick={() => addItem(elem)}
              className="ml-4 text-sm selectedInList"
            >
              {elem.name}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap w-full gap-2.5 mt-5">
          {selectedItems?.map((selectedItem, index: number) => (
            <div key={index} className="flex items-center flex-nowrap">
              <span className="ml-4 text-sm selectedInList">
                {selectedItem.name}
              </span>
              <button
                onClick={() => {
                  deleteItem(selectedItem);
                }}
              >
                X
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={saveButtonClickHandler}
          className="bg-[#1a5ce5] text-white px-4 py-2.5 rounded-[10px] text-lg mt-5"
        >
          Сохранить
        </button>
      </div>
    </div>
  );
};

export default ChooseModal;
