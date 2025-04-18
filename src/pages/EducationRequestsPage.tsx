import { FC, useState, useEffect } from 'react';
import { useAppSelector } from '../redux/store';
import { useLazyGetEducationRequestsQuery } from '../redux/api/educationRequestApi';
import {
  isUserManager,
  isUserTeacher,
  isUserTeamlead,
} from '../helpers/userHelpers';

import Title from '../components/common/Title';
import PrimaryButton from '../components/common/PrimaryButton';
import EducationRequestModal from '../components/common/modals/EducationRequestModal';
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

  const [requestModal, setRequestModal] = useState<{
    status: boolean;
    request: IEducationRequest | null;
  }>({
    status: false,
    request: null,
  });

  const [getEducationRequests, { isLoading }] =
    useLazyGetEducationRequestsQuery();

  // TODO: за студента происходит два запроса при обновлении страницы (из-за того что currentTeam не подгружена)
  const fetchRequests = async () => {
    if (!currentIntensive) {
      return;
    }

    if (isUserTeacher(currentUser) && !currentTeam) {
      return;
    }

    try {
      const { data } = await getEducationRequests({
        intensiveId: currentIntensive.id,
        teamId:
          isUserTeacher(currentUser) && currentTeam ? currentTeam.id : null,
      });

      if (data) {
        setEducationRequests(data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [currentIntensive, currentTeam]);

  return (
    <>
      {requestModal.status && (
        <EducationRequestModal
          request={null}
          onClose={() =>
            setRequestModal({
              request: null,
              status: false,
            })
          }
          onCancel={() =>
            setRequestModal({
              request: null,
              status: false,
            })
          }
          onChangeRequest={(request) => {
            setEducationRequests([...educationRequests, request]);

            setRequestModal({
              request: null,
              status: false,
            });
          }}
        />
      )}

      <Title text="Образовательные запросы" />

      <div className="mt-4 sm:mt-8">
        {isUserTeamlead(currentUser, currentTeam) && (
          <div className="flex justify-end">
            <div className="ml-auto">
              <PrimaryButton
                children="Отправить образовательный запрос"
                clickHandler={() =>
                  setRequestModal({
                    status: true,
                    request: null,
                  })
                }
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 md:mt-6">
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
