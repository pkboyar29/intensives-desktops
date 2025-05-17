import { FC, useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../redux/store';
import { useLazyGetIntensiveAnswersQuery } from '../redux/api/intensiveAnswerApi';

import Skeleton from 'react-loading-skeleton';
import { Helmet } from 'react-helmet-async';
import Title from '../components/common/Title';
import { ToastContainer, toast } from 'react-toastify';

import { IIntensiveAnswerMark } from '../ts/interfaces/IIntensiveAnswer';
import IntensiveMarkForm from '../components/forms/IntensiveMarkForm';

const IntensiveMarksPage: FC = () => {
  const currentTeam = useAppSelector((state) => state.team.data);

  const [getIntensiveAnswers] = useLazyGetIntensiveAnswersQuery();

  const [intensiveAnswers, setIntensiveAnswers] = useState<
    IIntensiveAnswerMark[]
  >([]);

  const [currentStudentId, setCurrentStudentId] = useState<number>(0);
  const currentStudent = useMemo(
    () =>
      currentTeam?.studentsInTeam.find(
        (studentInTeam) => studentInTeam.student.id === currentStudentId
      ),
    [currentTeam, currentStudentId]
  );

  const currentIntensiveAnswerMark = useMemo(
    () =>
      intensiveAnswers.find(
        (intensiveAnswerMark) =>
          intensiveAnswerMark.student.id === currentStudentId
      ),
    [intensiveAnswers, currentStudentId]
  );

  useEffect(() => {
    const fetchIntensiveAnswers = async (teamId: number) => {
      const { data } = await getIntensiveAnswers({ teamId });

      if (data) {
        setIntensiveAnswers(data);
      }
    };

    if (currentTeam) {
      fetchIntensiveAnswers(currentTeam.id);
    }
  }, [currentTeam]);

  useEffect(() => {
    if (currentTeam && currentTeam.studentsInTeam.length > 0) {
      setCurrentStudentId(currentTeam.studentsInTeam[0].student.id);
    }
  }, [currentTeam]);

  const onStudentClick = (studentId: number) => {
    setCurrentStudentId(studentId);
  };

  return (
    <>
      <Helmet>
        <title>
          {currentTeam && `Оценки за интенсив | ${currentTeam.name}`}
        </title>
      </Helmet>

      <ToastContainer position="top-center" />

      {!currentTeam ? (
        <Skeleton />
      ) : (
        <>
          <Title text="Оценки за интенсив" />

          <div className="flex gap-16 mt-6">
            <div className="p-2 rounded-xl bg-another_white">
              <div className="text-base text-gray_3">Участники команды</div>

              <div className="flex flex-col gap-4 mt-4">
                {currentTeam?.studentsInTeam.map((studentInTeam) => (
                  <div
                    key={studentInTeam.student.id}
                    className={`select-none text-base cursor-pointer py-1.5 px-2 rounded-xl hover:text-blue transition duration-300 ease-in-out ${
                      currentStudentId === studentInTeam.student.id &&
                      'text-blue'
                    }`}
                    onClick={() => {
                      onStudentClick(studentInTeam.student.id);
                    }}
                  >
                    {studentInTeam.student.nameWithGroup}
                  </div>
                ))}
              </div>
            </div>

            {currentStudent && currentIntensiveAnswerMark ? (
              <IntensiveMarkForm
                studentInTeam={currentStudent}
                intensiveAnswerMark={currentIntensiveAnswerMark}
                afterChangeMark={(updatedMark) => {
                  setIntensiveAnswers((intensiveAnswers) =>
                    intensiveAnswers.map((answerMark) => {
                      if (answerMark.student.id === updatedMark.student) {
                        return {
                          ...answerMark,
                          intensiveMark: updatedMark,
                        };
                      } else {
                        return answerMark;
                      }
                    })
                  );
                }}
                afterDeleteMark={(studentId) => {
                  setIntensiveAnswers((intensiveAnswers) =>
                    intensiveAnswers.map((answerMark) => {
                      if (answerMark.student.id === studentId) {
                        return {
                          ...answerMark,
                          intensiveMark: null,
                        };
                      } else {
                        return answerMark;
                      }
                    })
                  );
                }}
              />
            ) : null}
          </div>
        </>
      )}
    </>
  );
};

export default IntensiveMarksPage;
