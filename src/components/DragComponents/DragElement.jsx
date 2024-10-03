import { useDrag } from 'react-dnd';

const DragElement = ({ data }) => {
  const [{ isDragStart, canDrag }, dragRef] = useDrag({
    type: 'ball',
    item: data,
    collect: (monitor) => ({
      isDragStart: monitor.isDragging(),
      canDrag: monitor.canDrag(),
    }),
  });

  return (
    <div ref={dragRef} className="flex items-center max-w-[200px]">
      <span className="ml-4 text-sm bg-gray_5 h-fit px-2 py-0.5 rounded-lg max-w-[10vw] overflow-hidden whitespace-nowrap text-ellipsis">
        {data.content}
      </span>
    </div>
  );
};

export default DragElement;
