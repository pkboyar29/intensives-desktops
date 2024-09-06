import { useEffect, useState } from 'react';
import PostService from '../API/PostService';
import {
  LineChart,
  Tooltip,
  CartesianGrid,
  Line,
  XAxis,
  YAxis,
} from 'recharts';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import SideMenu from '../components/SideMenu';

const StatisticsIntensive = () => {
  const [responseStatInt, setResponseStatInt] = useState([]);
  const [statisticsData, setStatisticsData] = useState([]);

  const transformDataResponse = (response) => {
    console.log(response);
    setStatisticsData(
      response
        .map((item) => ({
          score: item.final_mark || 0,
          name: item.student.last_name,
        }))
        .filter((obj) => obj.hasOwnProperty('name'))
        .sort((a, b) => a.name.localeCompare(b.name))
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await PostService.getStatisticsIntensiv(
          localStorage.getItem('id')
        ).then((response) => {
          setResponseStatInt(response.data);
          transformDataResponse(response.data);
        });
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
    console.log(statisticsData);
  }, []);

  return (
    <div className="body">
      <SideMenu />
      <div className="main-block">
        <div className="center-block">
          <div className="list-content column-container">
            <div className="title">
              <div className="font-32">
                Статистика за интенсив {responseStatInt[0]?.intensive}
              </div>
            </div>
            <div className="font-14">Оценки участников за интенсив</div>
            {statisticsData ? (
              <LineChart
                width={900}
                height={400}
                data={statisticsData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis dataKey="score" />
                <Tooltip />
                <CartesianGrid stroke="#f5f5f5" />
                <Line
                  type="type'basis"
                  dataKey="score"
                  stroke="#1A5CE5"
                  yAxisId={0}
                />
              </LineChart>
            ) : (
              <Skeleton />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsIntensive;
