import krest from '../icons/krest.svg';

const ElementWithButtKrest = (props) => {
  return (
    <div className="text-sm elementWithButtonKrest">
      <span
        style={{
          width: '100%',
          overflow: 'hidden',
          marginRight: '10px',
          textOverflow: 'ellipsis',
        }}
      >
        {props.propsName}
      </span>
      <button
        style={{ height: '12px', width: '12px' }}
        onClick={props.propsDelete}
      >
        <img
          height={10}
          width={10}
          loading="lazy"
          src={krest}
          className="aspect-[0.96] fill-black"
        />
      </button>
    </div>
  );
};

export default ElementWithButtKrest;
