import { FC, useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../redux/store';
import { useLazyGetIntensiveAnswersQuery } from '../redux/api/intensiveAnswerApi';

import Skeleton from 'react-loading-skeleton';
import { Helmet } from 'react-helmet-async';
import Title from '../components/common/Title';
import { ToastContainer } from 'react-toastify';

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

          {currentTeam.studentsInTeam.length === 0 ? (
            <div className="mt-6 text-xl font-bold text-black">
              В команде нету участников
            </div>
          ) : (
            <>
              <div className="block mt-6 xl:hidden">
                <div className="text-lg font-bold text-black">
                  Выбор участника команды
                </div>

                <select
                  onChange={(e) =>
                    onStudentClick(Number(e.currentTarget.value))
                  }
                  value={currentStudentId}
                  className="mt-3 bg-another_white rounded-xl p-2.5 min-w-[130px]"
                >
                  {currentTeam.studentsInTeam.map((studentInTeam) => (
                    <option
                      key={studentInTeam.student.id}
                      value={studentInTeam.student.id.toString()}
                    >
                      {studentInTeam.student.nameWithGroup}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-16 mt-6">
                <div className="hidden p-2 xl:block rounded-xl bg-another_white">
                  <div className="text-base text-gray_3">Участники команды</div>

                  <div className="flex flex-col h-[600px] gap-4 mt-4">
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
      )}
    </>
  );
};

export default IntensiveMarksPage;
