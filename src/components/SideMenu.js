import React, { useEffect, useState } from 'react';
import PostService from '../API/PostService';
import { Link } from 'react-router-dom';
import { formatDate, convertBackDateFormat } from '../utils';

const SideMenu = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [visible, setVisible] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const id = Number(localStorage.getItem('id'));
      try {
        await PostService.getIntensiv(id).then((res) => {
          setData(res.data);
          console.log(res.data);
          setVisible(true);
        });
      } catch (e) {
        setVisible(false);
      }
    };

    fetchData();
  }, []);

  return visible && windowWidth > 600 ? (
    <div className="side-menu-cont">
      <div className="column-container">
        <div className="title-block">
          <div className="font-18">Доступные роли</div>
        </div>
        <div className="header-list-conainer column-container">
          <div className="elem-list">
            <div className="font-14">Администратор</div>
          </div>
        </div>
      </div>
      <div className="column-container">
        <div className="title-block column-container">
          <div className="font-18">{data?.name}</div>
          <div className="font-14 color-title">
            {data
              ? formatDate(convertBackDateFormat(data?.created_at)) +
                ' - ' +
                (formatDate(convertBackDateFormat(data?.close_dt)) ||
                  'дата окончания не проставлена')
              : null}
          </div>
        </div>

        <div className="header-list-conainer column-container">
          <Link to="/intensiv" className="elem-list">
            Настройки интенсива
          </Link>
          <Link to="/statisticsIntensive" className="elem-list">
            Статистика
          </Link>
          <Link to="/commands" className="elem-list">
            Управление командами
          </Link>
          <Link to="/plan" className="elem-list">
            План интенсива
          </Link>
          <Link to="/manageMenu" className="elem-list">
            Управление системой
          </Link>
        </div>
      </div>
    </div>
  ) : null;
};

export default SideMenu;
