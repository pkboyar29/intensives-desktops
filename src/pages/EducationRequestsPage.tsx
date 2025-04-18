import { FC, useState, useEffect } from 'react';
import { useAppSelector } from '../redux/store';
import { useLazyGetEducationRequestsQuery } from '../redux/api/educationRequestApi';
import { isUserManager, isUserTeamlead } from '../helpers/userHelpers';

import Title from '../components/common/Title';
import PrimaryButton from '../components/common/PrimaryButton';
import Modal from '../components/common/modals/Modal';
import EducationRequestCard from '../components/EducationRequestCard';
import Skeleton from 'react-loading-skeleton';

import { IEducationRequest } from '../ts/interfaces/IEducationRequest';

const EducationRequestsPage: FC = () => {
  const currentUser = useAppSelector((state) => state.user.data);
  const currentTeam = useAppSelector((state) => state.team.data);
  const currentIntensive = useAppSelector((state) => state.intensive.data);

  const [educationRequests, setEducationRequests] = useState<
    IEducationRequest[]
  >([]);

  const [getEducationRequests, { isLoading }] =
    useLazyGetEducationRequestsQuery();

  useEffect(() => {
    const fetchEducationRequests = async () => {
      if (currentIntensive) {
        try {
          const { data } = await getEducationRequests(currentIntensive.id);

          if (data) {
            setEducationRequests(data);
          }
        } catch (e) {
          console.log(e);
        }
      }
    };

    fetchEducationRequests();
  }, [currentIntensive]);

  return (
    <>
      <Title text="Образовательные запросы" />

      <div className="mt-4 sm:mt-8">
        {isUserTeamlead(currentUser, currentTeam) && (
          <div className="flex justify-end">
            <div className="ml-auto">
              <PrimaryButton
                children="Отправить образовательный запрос"
                clickHandler={() => console.log('sending...')}
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        {isLoading ? (
          <Skeleton />
        ) : educationRequests.length === 0 ? (
          <div className="text-xl text-black">
            {isUserManager(currentUser)
              ? 'На данный момент образовательных запросов нету'
              : 'Команда еще не отправила ни одного образовательного запроса'}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {educationRequests?.map((request) => (
              <EducationRequestCard
                key={request.id}
                educationRequest={request}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default EducationRequestsPage;
