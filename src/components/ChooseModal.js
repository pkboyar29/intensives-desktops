import { useState, useEffect } from 'react'

const ChooseModal = (props) => {
  const [items, setitems] = useState(props.items)
  const [selectedItem, setSelectedItem] = useState(props.itemsForResults)

  const addItem = (elem) => {
    setSelectedItem([...selectedItem, elem])
    setitems(items.filter((item) => item.id != elem.id))
  }

  const deleteItem = (elem) => {
    setSelectedItem(selectedItem.filter((item) => item.id != elem.id))
    setitems([...items, elem])
  }

  useEffect(() => {
    setSelectedItem(props.itemsForResults)
    const ids = selectedItem?.map((item) => item.id)
    setitems(props.items.filter((elem) => !ids.includes(elem.id)))
  }, [props.items, props.itemsForResults])

  return props.isOpen ? (
    <div className='fixed'
      style={
        {
          top: '50%',
          left: '50%',
          zIndex: '10',
          transform: 'translate(-50%, -50%)',
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgb(0 0 0 / 28%)'
        }
      }>
      <div
        className='bg-white border modal p-8 rounded z-10'
        style={{
          top: '50%',
          left: '50%',
          position: 'relative',
          transform: 'translate(-50%, -50%)',
          width: '70vw',
          height: 'max-content'
        }}>
        <div
          className='w-100'
          style={{
            position: 'relative',
            height: '100%'
          }}>
          <div
            className='space-y-2'
            style={{
              height: 'max-content',
            }}>
            <div className='flex'>
              <div className='border-b text-lg'>Выберите элементы</div>
              <button
                className='margin-right'
                onClick={() => props.onClose(false)}>
                Закрыть
              </button>
            </div>
            <input
              type='text'
              placeholder='Поиск'
              className='w-full element-input-style' />
            <div
              className='container-model-choose w-full flex flex-wrap'
              style={(items.length > 0) ? {} : {
                height: '20vh',
              }}>
              {items.map((elem) => (
                <div
                  onClick={() => addItem(elem)}
                  className='ml-4 text-sm selectedInList'>
                  {elem.name}
                </div>
              ))}
            </div>
            <div
              className='flex flex-wrap w-full'
              style={{
                height: 'max-content',
                minHeight: '5vh'
              }}>
              {selectedItem?.map((elem) => (
                <div style={{ marginRight: '10px' }} className='smile align-center flex flex-nowrap'>
                  <span className='ml-4 text-sm selectedInList'>{elem.name}</span>
                  <button
                    onClick={() => {
                      deleteItem(elem)
                    }}>
                    X
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                props.onSave(selectedItem);
                props.onClose(false);
              }}
              className='button-classic'>
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null
}

export { ChooseModal }