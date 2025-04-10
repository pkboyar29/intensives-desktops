import { FC } from 'react';

const NotFoundPage: FC = () => {
  return (
    <div className="pt-[88px] h-screen grid grid-cols-[auto,1fr]">
      <div className="text-red">404 NOT FOUND</div>
    </div>
  );
};

export default NotFoundPage;
