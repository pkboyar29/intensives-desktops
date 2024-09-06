const SelectDescription = (props) => {
  const handleInputChange = (event) => {
    const enteredValue = event.target.value;
    if (props.option.find((elem) => elem.name === enteredValue)) {
      props.onChange(enteredValue.id);
      console.log('enteredValue', enteredValue);
    }
  };

  return (
    <div className="element-list-input column-container">
      <div>{props.descriptionProp}</div>
      <input
        list={props.listName}
        className="element-input-style"
        value={props.value}
        onInput={handleInputChange}
        placeholder={
          props.placeholderProp ? props.placeholderProp : props.descriptionProp
        }
      />
      <datalist id={props.listName}>
        {props.option.map((elem) => (
          <option key={elem.id} value={elem.name}></option>
        ))}
      </datalist>
    </div>
  );
};

export { SelectDescription };
