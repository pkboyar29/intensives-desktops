const InputRadio = (props) => {
  const func = (props.valueProp == 1 || props.valueProp == 'label1' || props.valueProp == 'label2') ? () => { props.funcProp(props.valueProp) } : null

  return (
    <div className='radio-button'>
      <input
        type='radio'
        name={props.nameProp}
        value={props.valueProp}
        onChange={(props.isList) ? func : props.funcProp} />
      <label className='p-2' htmlFor={props.valueProp}>{props.descriptionProp}</label>

      <div className={props.children && props.activeProp == props.valueProp
        ? 'element-list-input column-container'
        : 'hidden'}>

        {props.children}
      </div>
    </div>
  )
}

export { InputRadio }