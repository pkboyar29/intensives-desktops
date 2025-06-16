import { UserRole } from '../ts/interfaces/IUser';

const redirectByRole = (role: UserRole) => {
  window.location.assign(
    role.name === 'Admin' ? '/admin/universities' : '/intensives'
  );
};

const getRedirectedPathByRole = (role: UserRole) => {
  return role.name === 'Admin' ? '/admin/universities' : '/intensives';
};

export { redirectByRole, getRedirectedPathByRole };
