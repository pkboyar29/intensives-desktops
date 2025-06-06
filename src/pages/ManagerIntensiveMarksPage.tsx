import { FC, useState, useEffect } from 'react';
import { useAppSelector } from '../redux/store';
import { createColumnHelper } from '@tanstack/react-table';
import {
  useGetIntensiveMarksQuery,
  useLazyExportIntensiveMarksQuery,
} from '../redux/api/intensiveMarkApi';
import { useParams } from 'react-router-dom';
import { useLazyGetGroupsQuery } from '../redux/api/groupApi';
import { toast } from 'react-toastify';

import Skeleton from 'react-loading-skeleton';
import { Helmet } from 'react-helmet-async';
import PrimaryButton from '../components/common/PrimaryButton';
import Title from '../components/common/Title';
import Table from '../components/common/Table';

import { IIntensiveMarkManager } from '../ts/interfaces/IIntensiveMark';
import { IFlow } from '../ts/interfaces/IFlow';

const ManagerIntensiveMarksPage: FC = () => {
  const currentIntensive = useAppSelector((state) => state.intensive.data);
  const { intensiveId } = useParams();

  const [exportMarks] = useLazyExportIntensiveMarksQuery();
  const [getGroups] = useLazyGetGroupsQuery();
  const { data: intensiveMarks } = useGetIntensiveMarksQuery(
    Number(intensiveId)
  );
  const [filteredMarks, setFilteredMarks] = useState<IIntensiveMarkManager[]>(
    []
  );

  const [currentGroupId, setCurrentGroupId] = useState<number>(0);
  const [groups, setGroups] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    if (currentIntensive) {
      fetchIntensiveGroups(currentIntensive.flows);
    }
  }, [currentIntensive]);

  useEffect(() => {
    if (intensiveMarks) {
      setFilteredMarks(intensiveMarks);
    }
  }, [intensiveMarks]);

  useEffect(() => {
    if (intensiveMarks) {
      if (currentGroupId == 0) {
        setFilteredMarks(intensiveMarks);
      } else {
        setFilteredMarks(
          intensiveMarks.filter(
            (mark) => mark.student.group.id === currentGroupId
          )
        );
      }
    }
  }, [currentGroupId, intensiveMarks]);

  const fetchIntensiveGroups = async (flows: IFlow[]) => {
    const allGroups = await Promise.all(
      flows.map(async (flow) => {
        const { data } = await getGroups({ flow: flow.id });
        return data ? data.results : [];
      })
    );

    setGroups(allGroups.flat());
  };

  const handleGroupSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCurrentGroupId(Number(event.target.value));
  };

  const handleExportClick = async () => {
    const args: any = {
      intensiveId: Number(intensiveId),
    };
    if (currentGroupId != 0) {
      args.groupId = currentGroupId;
    }

    const { data, error } = await exportMarks(args);
    if (error) {
      toast('Произошла серверная ошибка при экспорте оценок', {
        type: 'error',
      });
      return;
    }

    if (data) {
      const url = window.URL.createObjectURL(data.file);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', data.fileName);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      link.remove();
    }
  };

  const columnHelper = createColumnHelper<IIntensiveMarkManager>();
  const columns = [
    columnHelper.accessor('id', {
      header: () => 'ID',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('student', {
      header: () => 'Студент',
      cell: (info) =>
        `${info.getValue().user.lastName} ${info.getValue().user.firstName} ${
          info.getValue().user.patronymic
        }`,
    }),
    columnHelper.accessor('student.group', {
      header: () => 'Группа',
      cell: (info) => info.getValue().name,
    }),
    columnHelper.accessor('mark', {
      header: () => 'Оценка',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('teacher', {
      header: () => 'Тьютор',
      cell: (info) => info.getValue().name,
    }),
  ];

  return (
    <>
      <Helmet>
        <title>
          {currentIntensive && `Оценки за интенсив | ${currentIntensive.name}`}
        </title>
      </Helmet>

      <Title text="Оценки за интенсив" />

      <div className="flex justify-between gap-3 mt-4">
        <div>
          <div className="text-lg font-bold text-black">Выбор группы</div>

          <select
            value={currentGroupId}
            onChange={handleGroupSelectChange}
            className="bg-another_white rounded-xl p-2.5 min-w-[130px] mt-2"
          >
            <option key={0} value="0">
              Все
            </option>
            {groups.map((group) => (
              <option key={group.id} value={group.id.toString()}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <PrimaryButton
            children="Экспорт в xlsx"
            clickHandler={handleExportClick}
          />
        </div>
      </div>

      {intensiveMarks ? (
        <>
          <Table columns={columns} data={filteredMarks} />

          {filteredMarks.length == 0 && (
            <div className="mt-3 text-2xl text-center">Нет оценок</div>
          )}
        </>
      ) : (
        <div className="mt-6">
          <Skeleton />
        </div>
      )}
    </>
  );
};

export default ManagerIntensiveMarksPage;
