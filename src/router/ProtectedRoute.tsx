import { FC, PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../redux/store';

import { UserRoleKey } from '../ts/interfaces/IUser';

type ProtectedRouteProps = PropsWithChildren<{
  resolvedRoles: UserRoleKey[];
}>;

const ProtectedRoute: FC<ProtectedRouteProps> = ({
  resolvedRoles,
  children,
}) => {
  const currentUser = useAppSelector((state) => state.user.data);

  const hasAccess =
    currentUser &&
    currentUser.currentRole &&
    resolvedRoles.includes(currentUser.currentRole.name);

  return hasAccess ? <>{children}</> : <Navigate to={'/not-found'} />;
};

export default ProtectedRoute;
