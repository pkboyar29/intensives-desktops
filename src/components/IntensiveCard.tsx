import { FC } from 'react';
import { IIntensiveShort } from '../ts/interfaces/IIntensive';

interface IntensiveCardProps {
  intensive: IIntensiveShort;
  onClick: (intensiveId: number) => void;
}

const IntensiveCard: FC<IntensiveCardProps> = ({ intensive, onClick }) => {
  return (
    <div
      onClick={() => onClick(intensive.id)}
      className="h-32 p-2 border border-solid cursor-pointer md:p-5 group border-gray rounded-xl"
    >
      <div className="flex justify-between gap-4">
        <div className="w-auto md:w-[450px] lg:w-[750px]">
          <div className="text-lg font-bold transition duration-300 ease-in-out md:text-xl text-black_2 group-hover:text-blue">
            {intensive.name}
          </div>

          <div className="hidden mt-3 break-words line-clamp-3 md:block">
            {intensive.description}
          </div>
        </div>

        <div className="text-base text-right md:text-lg">
          {`${intensive.openDate.toLocaleDateString()} - ${intensive.closeDate.toLocaleDateString()}`}
        </div>
      </div>
    </div>
  );
};

export default IntensiveCard;
