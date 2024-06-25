const Modal = ({ isOpen, onClose }) => {
  return isOpen ? (
    <div
      className='absolute bg-white border modal p-8 rounded'
      style={{
        top: '50%',
        left: '50%',
        zIndex: '10',
        transform: 'translate(-50%, -50%)',
        maxWidth: '638px',
      }}
    >
      <div className='flex flex-col modal-content g-4' style={{ gap:'26px' }}>
        <h2 className='font-bold font-18'>Изменения количества групп</h2>
        <div className='content'>
          При изменении количества групп, в которых уже есть участники, вы
          можете начать заполнение заново или сохранить уже добавленных
          участников в группах
        </div>
        <div className='flex justify-end'>
          <button className='button-ser' onClick={() => onClose(false)}>
            Очистить группы
          </button>
          <button style={{ marginLeft: '10px' }} className='button-classic' onClick={() => onClose(true)}>
            Сохранить участников
          </button>
        </div>
      </div>
    </div>
  ) : null
}

export default Modal