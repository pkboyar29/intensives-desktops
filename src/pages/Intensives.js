import PostService from '../API/PostService';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { formatDate, convertBackDateFormat } from '../utils';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Intensives = () => {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    const filteredIntensives = data?.results.filter((result) =>
      result.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filteredIntensives);
  };

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        await PostService.getIntensives().then((response) => {
          setData(response.data);
        });
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
    localStorage.setItem('id', -1);
  }, []);

  const fillIntensiveTable = (props) => {
    if (!data) {
      return null;
    }
    let intensives = (props ? props : data.results)
      .filter((result) => {
        // Фильтрация по полю is_open и текущему значению фильтра
        if (filter === 'active') {
          return result.is_open;
        } else if (filter === 'past') {
          return !result.is_open;
        } else {
          return true; // Отображение всех интенсивов при значении 'all' фильтра
        }
      })
      .map((results) => (
        <tr key={results.id} className="border-b">
          <td className="px-6 py-4">
            <Link
              to={'/intensiv'}
              onClick={() => {
                localStorage.setItem('id', results.id);
              }}
            >
              {results.name}{' '}
            </Link>
          </td>
          {windowWidth < 940 ? null : (
            <td className="px-6 py-4">{results.description}</td>
          )}
          {windowWidth < 720 ? null : (
            <td className="px-6 py-4">
              {formatDate(convertBackDateFormat(results.created_at))}
            </td>
          )}
          {windowWidth < 720 ? null : (
            <td className="px-6 py-4">
              {formatDate(convertBackDateFormat(results.updated_at))}
            </td>
          )}
          {windowWidth < 470 ? null : (
            <td className="px-6 py-4">{results.flow.map((elem) => elem)}</td>
          )}
        </tr>
      ));

    return intensives;
  };

  let intensives = searchQuery
    ? fillIntensiveTable(filteredData)
    : fillIntensiveTable();

  return (
    <div className="main-block">
      <div className="center-block w-100">
        <div className="w-100">
          <div className="bg-[#FFFFFF] p-6 w-full flex flex-col">
            <div className="title font-32">Интенсивы</div>
            <button className="button-classic margin-right">
              <Link to={{ pathname: '/createIntensive', propsNew: true }}>
                Создать интенсив
              </Link>
            </button>

            <div className="search-full-screen">
              <input
                className="w-full"
                name="search"
                placeholder="Поиск"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>

          <div className="px-6 py-4">
            <div className="filter">
              <button
                value="active"
                onClick={() => setFilter('active')}
                className={`rounded-md py-2 px-4 ${
                  filter === 'active' ? 'font-bold' : ''
                }`}
              >
                Актуальные
              </button>
              <button
                value="past"
                onClick={() => setFilter('past')}
                className={`rounded-md py-2 px-4 ${
                  filter === 'past' ? 'font-bold' : ''
                }`}
              >
                Прошедшие
              </button>
              <button
                value="all"
                onClick={() => setFilter('all')}
                className={`rounded-md py-2 px-4 ${
                  filter === 'all' ? 'font-bold' : ''
                }`}
              >
                Все
              </button>
              <div className="common-line-filter">
                <div className={filter === 'active' ? 'line-filter' : ''}></div>
                <div className={filter === 'past' ? 'line-filter' : ''}></div>
                <div className={filter === 'all' ? 'line-filter' : ''}></div>
                <div className="black-line-filter"></div>
              </div>
            </div>
            <div className="overflow-x-auto bg-white rounded-lg w-100">
              {intensives ? (
                <table className="table border rounded w-100">
                  <thead className="bg-[#F1F5F9] border-b">
                    <tr>
                      <th className="px-6 py-3 font-semibold text-left">
                        Название
                      </th>
                      {windowWidth < 940 ? null : (
                        <th className="px-6 py-3 font-semibold text-left">
                          Описание
                        </th>
                      )}
                      {windowWidth < 720 ? null : (
                        <th className="px-6 py-3 font-semibold text-left">
                          Начало интенсива
                        </th>
                      )}
                      {windowWidth < 720 ? null : (
                        <th className="px-6 py-3 font-semibold text-left">
                          Окончание интенсива
                        </th>
                      )}
                      {windowWidth < 470 ? null : (
                        <th className="px-6 py-3 font-semibold text-left">
                          Участники
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {intensives || (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center">
                          Загрузка данных...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                <div
                  style={{ height: '20vh', width: '50vw', overflow: 'hidden' }}
                >
                  <Skeleton height={'100%'} width={'100%'} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intensives;
