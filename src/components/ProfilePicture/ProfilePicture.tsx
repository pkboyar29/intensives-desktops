import { FC } from 'react';
import './ProfilePicture.css';

type ProfilePictureProps = {
  userId?: string;
  path?: string;
  size: number;
};

const ProfilePicture: FC<ProfilePictureProps> = ({ userId, path, size }) => {
  //будет сама картинка и ФИО, запрос будет здесь на получение этого по id или будет передаваться сюда из родительского компонента неизвестно
  return (
    <div className="profile-picture">
      <img
        src="https://via.placeholder.com/100"
        width={size}
        height={size}
        title="Иванов Иван Иванович"
        alt="profile_picture"
      />
    </div>
  );
};

export default ProfilePicture;
