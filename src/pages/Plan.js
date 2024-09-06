import { useEffect, useState } from 'react';
import SideMenu from '../components/SideMenu';
import PostService from '../API/PostService';
import arowBut from '../icons/arowBut.svg';
import { convertBackDateFormatDMY } from '../utils';
import { Link } from 'react-router-dom';

const Plan = () => {
  const [responseEvent, setResponseEvent] = useState([]);
  // Создаем объект для хранения результатов
  const [prepareEvent, setPrepareEvent] = useState([]);

  const prepareE = (arr) => {
    if (arr.length > 0) {
      let result = {};
      arr.forEach((obj) => {
        let objStage = obj.stage ?? 'without';
        if (!result[objStage]) {
          result[obj.stage ? obj.stage : 'without'] = {
            id: objStage,
            data: [],
          };
        }
        result[objStage].data.push({
          name: obj.name,
          dataStart: convertBackDateFormatDMY(obj.start_dt),
          dataEnd: convertBackDateFormatDMY(obj.finish_dt),
          id: obj.id,
        });
      });
      const finalResult = Object.values(result);
      setPrepareEvent(finalResult);
      console.log('prepareEvent', prepareEvent);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const idIntensive = localStorage.getItem('id');
      await Promise.all([PostService.getEvents(idIntensive)]).then(
        (response) => {
          console.log('response', response);
          prepareE(response[0].data.results);
          setResponseEvent(
            response[0].data.results.map((event) => {
              return {
                id: event.id,
                name: event.name,
                dataStart: event.start_dt,
                dataEnd: event.finish_dt,
                stage: event.stage,
              };
            })
          );
        }
      );
    };
    fetchData();
  }, []);

  const Stage = (data) => (
    <section className="flex flex-col justify-center items-start px-4 py-4 w-full leading-[150%] max-md:max-w-full">
      <h2 className="font-bold font-18">Мероприятия вне этапов</h2>
      {data.steps.map((step) => (
        <div
          key={step.name}
          className="flex p-4"
          onClick={() => {
            localStorage.setItem('idEvent', step.id);
            window.location.href = '/editEvent';
          }}
        >
          <div className="flex flex-col justify-center">
            <p className="p-1 text-base font-18">{step.name}</p>
            <time className="p-1 text-sm text-[#336699]/[.35] font-14">
              {step.dataStart + ' ' + step.dataEnd}
            </time>
          </div>
        </div>
      ))}
    </section>
  );

  return (
    <div className="body">
      <SideMenu />
      <div className="main-block">
        <div className="center-block">
          <div className="column-container">
            <div className="flex justify-between title align-center">
              <div className="font-32">План интенсива</div>
              <button className="flex button-ser gap">
                <div className="font-bold font-14">Редактировать</div>
                <img
                  height={10}
                  width={10}
                  loading="lazy"
                  src={arowBut}
                  className="aspect-[0.96] fill-black"
                />
              </button>
            </div>
            <div className="space"></div>
            {prepareEvent.length > 0 ? (
              prepareEvent.map((elem) => (
                <Stage key={elem.id} steps={elem.data} />
              ))
            ) : (
              <div
                className="gap_25"
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div className="flex justify-center">
                  Пока расписание пусто, добавьте мероприятия
                </div>
                <Link
                  className="text-blue-500"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                  to={'/editEvent'}
                  onClick={() => {
                    localStorage.removeItem('idEvent');
                  }}
                >
                  Добавить
                </Link>
              </div>
            )}
            {/* <Link className='text-blue-500'
							style={{
								display: 'flex',
								justifyContent: 'center'
							}} to={'/editEvent'} onClick={() => { localStorage.removeItem('idEvent') }}>Добавить</Link>
 */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plan;
