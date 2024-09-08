import { useEffect, useState } from 'react';
import PostService from '../../API/PostService';
import SideMenu from '../../components/SideMenu';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import InputDescription from '../../components/InputDescription';
import ElementWithButtKrest from '../../components/ElementWithButtKrest';

const ManageRoles = () => {
  const [data, setData] = useState([]);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        await PostService.getStudenRoles().then((res) => {
          setData(res.data.results);
        });
      } catch {}
    };
    fetchData();
  }, []);

  const addRole = () => {
    const fetchData = async () => {
      try {
        await PostService.postStudentsRole(newRole).then((res) => {
          setData([...data, res.data]);
          console.log('setData', data);
        });
      } catch (e) {
        console.log('catch', e);
      }
    };
    setNewRole('');
    if (newRole) fetchData();
  };

  const deleteRole = (id) => {
    const fetchData = async () => {
      try {
        await PostService.deleteStudentsRole(id).then(() => {
          setData(data.filter((elem) => elem.id !== id));
        });
      } catch {}
    };
    setNewRole('');
    fetchData();
  };

  return (
    <div className="body">
      <SideMenu />
      <div className="main-block">
        <div className="center-block">
          <div className="list-content column-container">
            <div className="title">
              <div className="font-32">Роли студентов</div>
            </div>
            <div className="column-container gap_25">
              <div className="font-18 bold-font">Все роли</div>
              <div className="flex flex-wrap">
                {data.length > 0 ? (
                  data
                    .filter((res) => res.for_student)
                    .map((elem) => (
                      <ElementWithButtKrest
                        key={String(elem.name) + elem.id}
                        propsName={elem.name}
                        propsDelete={() => deleteRole(elem.id)}
                      />
                    ))
                ) : (
                  <Skeleton></Skeleton>
                )}
              </div>
              <div className="font-18 bold-font">Добавить роль</div>
              <InputDescription
                descriptionProp={'Название роли'}
                valueProp={newRole}
                onChange={setNewRole}
                placeholderProp={'Введите название роли'}
              />
              <button className="button-classic" onClick={() => addRole()}>
                {' '}
                Добавить роль
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageRoles;
