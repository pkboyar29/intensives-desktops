import { useState } from 'react';
import PostService from '../../API/PostService';
import SideMenu from '../../components/SideMenu';
import 'react-loading-skeleton/dist/skeleton.css';
import Skeleton from 'react-loading-skeleton';
import { InputDescription } from '../../components/InputDescription';
import ElementWithButtKrest from '../../components/ElementWithButtKrest';

const ManageProfile = () => {
  const [data, setData] = useState([]);
  const [newProfile, setNewProfile] = useState('');

  const addFunc = () => {
    const fetchData = async () => {
      try {
        await PostService.postProfiles(newProfile).then((res) => {
          setData([...data, res.data]);
          console.log('setData', data);
        });
      } catch (e) {
        console.log('catch', e);
      }
    };
    setNewProfile('');

    if (newProfile) fetchData();
  };

  const deleteFunc = (id) => {
    const fetchData = async () => {
      try {
        await PostService.deleteProfiles(id).then(() => {
          setData(data.filter((elem) => elem.id !== id));
        });
      } catch {}
    };
    setNewProfile('');

    fetchData();
  };
  console.log(data.length >= 1);

  return (
    <div className="body">
      <SideMenu />
      <div className="main-block">
        <div className="center-block">
          <div className="list-content column-container">
            <div className="title">
              <div className="font-32">Профили обучения</div>
            </div>
            <div className="column-container gap_25">
              <div className="font-18 bold-font">Все профили</div>
              <div className="flex flex-wrap">
                {false ? (
                  data.map((elem) => (
                    <ElementWithButtKrest
                      key={String(elem.name) + elem.id}
                      propsName={elem.name}
                      propsDelete={() => deleteFunc(elem.id)}
                    />
                  ))
                ) : (
                  <Skeleton count={2}></Skeleton>
                )}
              </div>
              <div className="font-18 bold-font">Добавить профили</div>
              <InputDescription
                descriptionProp={'Название профиля'}
                valueProp={newProfile}
                onChange={setNewProfile}
                placeholderProp={'Введите название профиля'}
              />
              <button className="button-classic" onClick={() => addFunc()}>
                {' '}
                Добавить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProfile;
