import { FC } from 'react';

interface TitleProps {
  text: string;
}

const Title: FC<TitleProps> = ({ text }) => {
  return <h1 className="font-sans text-3xl font-bold">{text}</h1>;
};

export default Title;
