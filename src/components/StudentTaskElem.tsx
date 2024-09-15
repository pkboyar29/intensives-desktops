import { Task } from '../ts/types/Task';

export default function StudentTaskElem(props: Task) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex space-x-4">
        <img src="https://via.placeholder.com/50" />
        <div className="flex flex-col space-y-2">
          <p className="text-xl font-semibold">{props.name}</p>
          <p>{props.desc}</p>
        </div>
      </div>
      <p>{props.finish_dt.toLocaleDateString()}</p>
    </div>
  );
}
