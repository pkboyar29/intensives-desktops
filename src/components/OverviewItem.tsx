import { FC } from 'react';

interface OverviewItemProps {
  title: string;
  value: string | undefined;
}

const OverviewItem: FC<OverviewItemProps> = ({ title, value }) => {
  return (
    <>
      <div>
        <h2 className="font-sans text-xl font-bold text-black">{title}</h2>
        <div className="mt-2 font-sans text-base text-bright_gray">{value}</div>
      </div>
    </>
  );
};

export default OverviewItem;
