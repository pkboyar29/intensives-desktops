import { FC } from 'react';

interface TitleProps {
  text: string;
}

const Title: FC<TitleProps> = ({ text }) => {
  return <h1 className="text-[32px] font-bold">{text}</h1>;
};

export default Title;
