const InputDescription = (props) => {
  return (
    <div className="element-list-input column-container">
      <div className="">{props.descriptionProp}</div>
      <input
        value={props.valueProp}
        onChange={(e) => props.onChange(e.target.value)}
        type={props.typeProp ? props.typeProp : 'text'}
        className="element-input-style"
        placeholder={
          props.placeholderProp ? props.placeholderProp : props.descriptionProp
        }
      ></input>
    </div>
  );
};

export { InputDescription };
