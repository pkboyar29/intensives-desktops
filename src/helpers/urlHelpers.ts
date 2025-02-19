import { UserRole } from '../ts/interfaces/IUser';

const replaceLastURLSegment = (segment: string): string => {
  const pathSegments = location.pathname.split('/');
  pathSegments.pop();
  pathSegments.push(`${segment}`);
  const newPath = pathSegments.join('/');
  return newPath;
};

const redirectByRole = (role: UserRole) => {
  window.location.assign(role.name === 'Admin' ? '/admin' : '/intensives');
};

export { replaceLastURLSegment, redirectByRole };
