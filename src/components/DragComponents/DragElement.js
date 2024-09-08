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
      <span className="ml-4 text-sm element-st">{data.content}</span>
    </div>
  );
};

export default DragElement;
