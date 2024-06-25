import { useDrag } from "react-dnd"

const DragElement = ({ data, setSelectedMembers, selectedMembers }) => {
  const [{ isDragStart, canDrag }, dragRef] = useDrag({
    type: "ball",
    item: data,
    collect: (monitor) => ({
      isDragStart: monitor.isDragging(),
      canDrag: monitor.canDrag(),
    }),
  })

  const handleClick = (data) => {
  }

  return (
    <div
      ref={dragRef}
      onClick={handleClick()}
      className={
        isDragStart ? 'dragged flex items-center' : 'flex items-center'
      } >
      <span className='ml-4 text-sm element-st'>{data.content}</span>
    </div>
  )
}

export default DragElement