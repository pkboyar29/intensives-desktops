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
import { useParams } from 'react-router-dom';

import Title from '../components/Title';

const IntensiveStatisticsPage = () => {
  const [statisticsData, setStatisticsData] = useState<any[]>([]);
  const { intensiveId } = useParams();

  const transformDataResponse = (response: any) => {
    setStatisticsData(
      response
        .map((item: any) => ({
          score: item.final_mark || 0,
          name: item.student.last_name,
        }))
        .filter((obj: any) => obj.hasOwnProperty('name'))
        .sort((a: any, b: any) => a.name.localeCompare(b.name))
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (intensiveId) {
          const { data } = await PostService.getStatisticsIntensiv(intensiveId);

          transformDataResponse(data);
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex justify-center min-h-screen min-w-[50vw] max-w-[1280px]">
      <div className="list-content">
        <Title text="Статистика за интенсив" />
        <div className="text-base">Оценки участников за интенсив</div>
        {statisticsData ? (
          <LineChart width={900} height={400} data={statisticsData}>
            <XAxis dataKey="name" />
            <YAxis dataKey="score" />
            <Tooltip />
            <CartesianGrid stroke="#f5f5f5" />
            <Line type="basis" dataKey="score" stroke="#1A5CE5" yAxisId={0} />
          </LineChart>
        ) : (
          <Skeleton />
        )}
      </div>
    </div>
  );
};

export default IntensiveStatisticsPage;
