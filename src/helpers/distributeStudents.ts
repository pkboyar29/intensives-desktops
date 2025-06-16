import { IStudent } from '../ts/interfaces/IStudent';
import { ITeamManager } from '../ts/interfaces/ITeam';

const distributeStudents = (
  allStudents: IStudent[],
  teams: ITeamManager[]
): ITeamManager[] => {
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

  Object.values(studentsByGroup).forEach((groupStudents) => {
    const groupCopy = [...groupStudents];

    let teamIndex = 0;

    while (groupCopy.length > 0) {
      const randomStudentIndex = Math.floor(Math.random() * groupCopy.length);
      const [student] = groupCopy.splice(randomStudentIndex, 1);

      newTeams[teamIndex % teams.length].studentsInTeam.push(student);
      teamIndex++;
    }
  });

  return newTeams;
};

export { distributeStudents };
