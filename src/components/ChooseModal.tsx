import { useState, useEffect, FC } from 'react';

interface ChooseModalProps {
  itemsProp: any[];
  itemsForResults: any[];
  onClose: () => void;
  onSave: () => void;
}

const ChooseModal: FC<ChooseModalProps> = ({
  itemsProp,
  itemsForResults,
  onClose,
  onSave,
}) => {
  const [items, setitems] = useState(itemsProp);
  const [selectedItem, setSelectedItem] = useState(itemsForResults);

  const addItem = (elem: any) => {
    setSelectedItem([...selectedItem, elem]);
    setitems(items.filter((item) => item.id != elem.id));
  };

  const deleteItem = (elem: any) => {
    setSelectedItem(selectedItem.filter((item: any) => item.id != elem.id));
    setitems([...items, elem]);
  };

  useEffect(() => {
    setSelectedItem(itemsForResults);
    const ids = selectedItem?.map((item: any) => item.id);
    setitems(items.filter((elem) => !ids.includes(elem.id)));
  }, [items, itemsForResults]);

  const closeButtonClickHandler = () => {
    onClose();
  };

  const saveButtonClickHandler = () => {
    onSave();
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

        <div
          className="mt-3 w-full h-full rounded-lg overflow-y-auto overflow-x-clip gap-1.5 flex flex-wrap p-2.5 border border-dashed border-[#637087]"
          style={
            items.length > 0
              ? {}
              : {
                  height: '20vh',
                }
          }
        >
          {items.map((elem) => (
            <div
              onClick={() => addItem(elem)}
              className="ml-4 text-sm selectedInList"
            >
              {elem.name}
            </div>
          ))}
        </div>

        <div
          className="flex flex-wrap w-full"
          style={{
            height: 'max-content',
            minHeight: '5vh',
          }}
        >
          {selectedItem?.map((elem) => (
            <div
              style={{ marginRight: '10px' }}
              className="flex items-center flex-nowrap"
            >
              <span className="ml-4 text-sm selectedInList">{elem.name}</span>
              <button
                onClick={() => {
                  deleteItem(elem);
                }}
              >
                X
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={saveButtonClickHandler}
          className="bg-[#1a5ce5] text-white px-4 py-2.5 rounded-[10px] text-lg"
        >
          Сохранить
        </button>
      </div>
    </div>
  );
};

export default ChooseModal;
