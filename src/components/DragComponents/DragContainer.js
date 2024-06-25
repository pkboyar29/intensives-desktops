import { useState, useEffect } from 'react'
import { useDrop } from 'react-dnd'
import DraggingElement from './DraggingElement'

const DragContainer = ({ teamName, func, team }) => {
  const [draggedElements, setDraggedElements] = useState([]);

  useEffect(() => {
    return () => {
      func([...team, ...draggedElements]);
    }
  }, [])

  const deleteItemFromCont = (item) => {
    func([...team, item]);
    setDraggedElements(draggedElements.filter(elem => item.index != elem.index))
  }

  const [{ isDragging }, dropRef] = useDrop({
    accept: 'ball',
    drop(data) {
      if (!(draggedElements.find((item) => item.index == data.index))) setDraggedElements([...draggedElements, data]);
      func(team.filter((item) => item.index !== data.index));
    },
    collect: (monitor) => ({
      isDragging: monitor.isOver()
    }),
  });

  return (
    <div
      key={'key' + team.length}
      ref={dropRef}
      className={
        isDragging
          ? 'flex flex-col column-command-create border-drag-and-drop'
          : 'flex flex-col column-command-create'
      }
      onDragOver={(evt) => evt.preventDefault()} >
      <div className='flex items-center space-x-2'>
        <span className='font-semibold text-[#333]'>{teamName}</span>
      </div>

      {draggedElements.length ? '' : <span className='text-sm text-[#6B7280]'>Нет участников</span>}

      {draggedElements.map((smile) => (
        <DraggingElement key={smile.index} data={smile} func={setDraggedElements} dragElements={draggedElements} deleteI={deleteItemFromCont} />
      ))}
      <select className='mini-element-input-style'>
        <option>Добавить участника</option>
      </select>
    </div>
  )
}

export default DragContainer