import { FC } from 'react';
import { Helmet } from 'react-helmet-async';

const NotFoundPage: FC = () => {
  return (
    <>
      <Helmet>
        <title>404 Страница не найдена</title>
      </Helmet>
      <div className="text-red pt-[88px]">404 Страница не найдена</div>
    </>
  );
};

export default NotFoundPage;
