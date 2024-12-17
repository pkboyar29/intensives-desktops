import { FC } from 'react';
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { IColumn } from '../../ts/interfaces/IColumn';
import KanbanColumn from '../KanbanColumn';

interface DragKanbanColumnProps {
    column: IColumn;
    index: number;
    moveColumn: (dragIndex: number, hoverIndex: number) => void;
}

const DragKanbanColumn: FC<DragKanbanColumnProps> = ({ column, index, moveColumn }) => {

    const ref = React.useRef<HTMLDivElement>(null);

    const [, drop] = useDrop({
      accept: 'COLUMN',
      hover: (item: { index: number }) => {
        if (!ref.current) return;
        const dragIndex = item.index;
        const hoverIndex = index;
  
        if (dragIndex === hoverIndex) return;
  
        moveColumn(dragIndex, hoverIndex);
        item.index = hoverIndex;
      },
    });

    const [{ isDragging }, drag] = useDrag({
        type: 'COLUMN',
        item: { index },
        collect: (monitor) => ({
          isDragging: monitor.isDragging(),
        }),
    });
    
    drag(drop(ref));

    return (
        <div
            ref={ref}
            className={`opacity-${isDragging ? '50' : '100'} transition-opacity duration-300`}
            style={{
              cursor: "grab",
              border: isDragging ? "2px dashed #ccc" : "none",
              backgroundColor: isDragging ? "#f8f9fa" : "white",
        }}>
          
        </div>
    );
};

export default DragKanbanColumn;