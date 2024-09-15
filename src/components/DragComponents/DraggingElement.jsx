import { useDrag } from 'react-dnd';
const DraggingElement = ({ data, func, dragElements, deleteI }) => {
  const deleteItem = () => {
    func(dragElements.filter((item) => item.index != data.index));
  };

  const [{ isDragStart, canDrag, endDrag }, dragRef] = useDrag({
    type: 'ball',
    item: data,
    collect: (monitor) => ({
      isDragStart: monitor.isDragging(),
      canDrag: monitor.canDrag(),
    }),
    end: (item, monitor) => {
      const didDrop = monitor.didDrop();
      const elem = monitor.getItem() == monitor.getDropResult().name;
      if (didDrop) {
        deleteItem();
      }
    },
  });

  return (
    <div ref={dragRef} className="smile" draggable>
      <span className="ml-4 text-sm rounded-lg border-none outline-none bg-[#f0f2f5] w-min appearance-none">
        {data.content}
      </span>
      <button
        onClick={() => {
          deleteI(data);
        }}
      >
        ✕
      </button>
    </div>
  );
};

export default DraggingElement;
