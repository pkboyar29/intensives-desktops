import { IEvent, IEventShort } from '../ts/interfaces/IEvent';
import { ITeam } from '../ts/interfaces/ITeam';
import { IUser } from '../ts/interfaces/IUser';

export const isUserStudent = (currentUser: IUser | null): boolean =>
  !!currentUser?.currentRole && currentUser.currentRole.name === 'Student';

export const isUserTeacher = (currentUser: IUser | null): boolean =>
  !!currentUser?.currentRole && currentUser.currentRole.name === 'Teacher';

export const isUserManager = (currentUser: IUser | null): boolean =>
  !!currentUser?.currentRole && currentUser.currentRole.name === 'Manager';

export const isUserAdmin = (currentUser: IUser | null): boolean =>
  !!currentUser?.currentRole && currentUser.currentRole.name === 'Admin';

export const isUserMentor = (currentUser: IUser | null): boolean =>
  !!currentUser?.currentRole && currentUser.currentRole.name === 'Mentor';

export const isUserTeamlead = (
  currentUser: IUser | null,
  team: ITeam | null
): boolean =>
  isUserStudent(currentUser) && team?.teamlead?.id === currentUser?.studentId;

export const isUserTutor = (
  currentUser: IUser | null,
  team: ITeam | null
): boolean =>
  isUserTeacher(currentUser) && team?.tutor?.id === currentUser?.teacherId;

export const isUserMentorInCurrentTeam = (
  currentUser: IUser | null,
  team: ITeam | null
): boolean =>
  isUserMentor(currentUser) && team?.mentor?.id === currentUser?.studentId;

// export const isUserJury = (currentUser: IUser | null, event: IEvent | IEventShort): boolean => isUserTeacher(currentUser) && event.teachers.includes(currentUser?.teacherId);
