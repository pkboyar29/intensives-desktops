import { useEffect, useState } from 'react';
import PostService from '../../API/PostService';
import SideMenu from '../../components/SideMenu';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { InputDescription } from '../../components/InputDescription';
import ElementWithButtKrest from '../../components/ElementWithButtKrest';

const ManageProfile = () => {
  const [data, setData] = useState([]);
  const [newProfile, setNewProfile] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        await PostService.getProfiles().then((res) => {
          setData(res.data.results);
        });
      } catch {}
    };

    fetchData();
  }, []);

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
                {data.length > 0 ? (
                  data.map((elem) => (
                    <ElementWithButtKrest
                      key={String(elem.name) + elem.id}
                      propsName={elem.name}
                      propsDelete={() => deleteFunc(elem.id)}
                    />
                  ))
                ) : (
                  <Skeleton></Skeleton>
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
