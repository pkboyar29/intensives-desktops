const InputDescription = (props) => {
  return (
    <div className="flex flex-col w-full gap-2 my-3 text-lg">
      <div>{props.descriptionProp}</div>
      <input
        value={props.valueProp}
        onChange={(e) => props.onChange(e.target.value)}
        type={props.typeProp ? props.typeProp : 'text'}
        className="p-2.5 rounded-[10px] bg-[#f0f2f5]"
        placeholder={
          props.placeholderProp ? props.placeholderProp : props.descriptionProp
        }
      />
    </div>
  );
};

export default InputDescription;
