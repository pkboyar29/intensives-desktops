const InputDelete = (props) => {
  return (
    <div className='element-list-input flex'>
      <input name={props.nameProp} placeholder={props.placeholderProp} className='element-input-style w-100'></input>
      <button onClick={() => props.deleteProp(props.nameProp)}>
        <img
          height={20}
          width={20}
          loading='lazy'
          src='https://cdn.builder.io/api/v1/image/assets/TEMP/c23adc78217a94444c5183979d69d64279102220acf0389828fbda3bf2e0c47f?apiKey=d356808278d742219dce7d95e695ad7e&'
          className='aspect-[0.96] fill-black w-[23px]'
        />
      </button>
    </div>
  )
}

export { InputDelete }