import { IStudent } from '../ts/interfaces/IStudent';
import { ITeamManager } from '../ts/interfaces/ITeam';

const distributeStudents = (
  allStudents: IStudent[],
  teams: ITeamManager[]
): ITeamManager[] => {
  // минимальное количество студентов в команде
  // const minStudentsCountPerTeam = Math.floor(allStudents.length / teamsCount);
  // console.log(allStudents.length);
  // console.log(minStudentsCountPerTeam);

  // структура данных, чтобы перемещаться по каждой группе
  const studentsByGroup: Record<number, IStudent[]> = {};

  allStudents.forEach((student) => {
    if (!studentsByGroup[student.group.id]) {
      studentsByGroup[student.group.id] = [];
    }

    studentsByGroup[student.group.id].push(student);
  });

  let newTeams: ITeamManager[] = teams.map((team) => ({
    ...team,
    studentsInTeam: [],
  }));

  // итерируемся по массивам студентов, сгрупированных по groupId
  Object.values(studentsByGroup).forEach((groupStudents) => {
    const groupCopy = [...groupStudents]; // клонируем, чтобы не мутировать оригинал

    let teamIndex = 0;

    while (groupCopy.length > 0) {
      // if (
      //   newTeams[teamIndex % teamsCount].studentsInTeam.length >=
      //   minStudentsCountPerTeam
      // ) {
      //   teamIndex++;
      //   continue;
      // }

      const randomStudentIndex = Math.floor(Math.random() * groupCopy.length);
      const [student] = groupCopy.splice(randomStudentIndex, 1); // берем студента из groupCopy и одновременно удаляем его

      newTeams[teamIndex % teams.length].studentsInTeam.push(student);
      teamIndex++;
    }
  });

  return newTeams;
};

export { distributeStudents };
