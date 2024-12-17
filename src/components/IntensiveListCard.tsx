import { FC } from 'react';
import { IIntensive } from '../ts/interfaces/IIntensive';

interface IntensiveListCardProps {
  intensive: IIntensive;
  onClick: (intensiveId: number) => void;
}

const IntensiveListCard: FC<IntensiveListCardProps> = ({
  intensive,
  onClick,
}) => {
  return (
    <div
      onClick={() => onClick(intensive.id)}
      className="h-32 p-5 border border-solid cursor-pointer group border-gray rounded-xl"
    >
      <div className="flex justify-between gap-4">
        <div>
          <div className="text-xl font-bold transition duration-300 ease-in-out text-black_2 group-hover:text-blue">
            {intensive.name}
          </div>

          <div className="mt-3 w-[750px] line-clamp-3">
            {intensive.description}
          </div>
        </div>

        <div className="text-lg">
          {`${intensive.openDate.toLocaleDateString()} - ${intensive.closeDate.toLocaleDateString()}`}
        </div>
      </div>
    </div>
  );
};

export default IntensiveListCard;
