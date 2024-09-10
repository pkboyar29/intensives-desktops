import { useState, useEffect, FC } from 'react';

import DragElement from '../components/DragComponents/DragElement';
import DragContainer from '../components/DragComponents/DragContainer';
import Title from '../components/Title/Title';

const base = [
  { index: 0, content: 'Мындрила М.А,' },
  { index: 1, content: 'Савенко М.А,' },
  { index: 2, content: 'Иванов М.А,' },
  { index: 3, content: 'Кузнецов М.А,' },
  { index: 4, content: 'Хлебников М.А,' },
  { index: 5, content: 'Шадрин М.А,' },
  { index: 6, content: 'Кудров М.А,' },
  { index: 7, content: 'Краснов М.А,' },
  { index: 8, content: 'Тереньтьев М.А,' },
  { index: 9, content: 'Краснов М.А,' },
  { index: 10, content: 'Иванов М.А,' },
];

const teamData = [
  { id: 'Команда1', name: 'Команда 1' },
  { id: 'Команда2', name: 'Команда 2' },
];

const CreateTeamsPage: FC = () => {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [countTeams, setCountTeams] = useState<number>(2);
  const [teams, setTeams] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    setTeamMembers(base);
    setTeams(teamData);
    setSearchResults(teamMembers);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (searchTerm)
      setSearchResults(
        teamMembers.filter((item) =>
          item.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    else {
      setSearchResults(teamMembers);
    }
  }, [searchTerm, teamMembers]);

  const numberTeamsInputChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCountTeams(parseInt(e.target.value));
  };

  const numberTeamsButtonClickHandler = () => {
    let massTeam = [];
    for (let i = 1; i <= countTeams; i++) {
      massTeam.push({ id: `Команда` + i, name: `Команда ${i}` });
    }
    setTeams(massTeam);
  };

  return (
    <div>
      <Title text="Команды" />

      <p className="text-base mt-2 text-[#6B7280]">
        Создайте команды и распределите участников интенсива по командам
      </p>

      <div className="flex gap-4 mt-5">
        <div className="relative w-[480px]">
          <input
            type="number"
            onChange={numberTeamsInputChangeHandler}
            className="p-2 border w-full border-[#D1D5DB] rounded-md"
            value={countTeams}
          />
          <svg
            className="absolute transform -translate-y-1/2 right-3 top-1/2"
            width="24"
            height="16"
            viewBox="0 0 24 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.9922 10.805C13.0561 9.43099 13.9769 6.86767 13.2592 4.49441C12.5414 2.12114 10.3544 0.497718 7.875 0.497718C5.39558 0.497718 3.20857 2.12114 2.49084 4.49441C1.7731 6.86767 2.69393 9.43099 4.75781 10.805C2.93952 11.4752 1.38666 12.7153 0.330938 14.3403C0.179932 14.5647 0.161484 14.8531 0.28266 15.095C0.403836 15.3368 0.645857 15.4947 0.916031 15.5081C1.18621 15.5215 1.44266 15.3884 1.58719 15.1597C2.97076 13.0317 5.33677 11.7479 7.875 11.7479C10.4132 11.7479 12.7792 13.0317 14.1628 15.1597C14.3917 15.4999 14.8514 15.5932 15.1948 15.3692C15.5382 15.1452 15.6381 14.6869 15.4191 14.3403C14.3633 12.7153 12.8105 11.4752 10.9922 10.805ZM3.75 6.125C3.75 3.84683 5.59683 2 7.875 2C10.1532 2 12 3.84683 12 6.125C12 8.40317 10.1532 10.25 7.875 10.25C5.5979 10.2474 3.75258 8.4021 3.75 6.125ZM23.4506 15.3781C23.1037 15.6043 22.6391 15.5066 22.4128 15.1597C21.0308 13.0303 18.6636 11.7466 16.125 11.75C15.7108 11.75 15.375 11.4142 15.375 11C15.375 10.5858 15.7108 10.25 16.125 10.25C17.7863 10.2484 19.2846 9.25041 19.9261 7.71798C20.5677 6.18554 20.2273 4.4178 19.0626 3.23312C17.898 2.04844 16.1363 1.67805 14.5931 2.29344C14.3427 2.40171 14.0531 2.36541 13.8372 2.19864C13.6212 2.03188 13.5128 1.76096 13.5542 1.49125C13.5956 1.22154 13.7802 0.995581 14.0363 0.90125C16.7109 -0.165433 19.7592 0.960007 21.099 3.50883C22.4388 6.05765 21.6374 9.2067 19.2422 10.805C21.0605 11.4752 22.6133 12.7153 23.6691 14.3403C23.8953 14.6872 23.7975 15.1518 23.4506 15.3781Z"
              fill="#4F7396"
            />
          </svg>
        </div>

        <button
          type="button"
          className="text-white bg-[#1a5ce5] py-2 px-4 rounded-xl"
          onClick={numberTeamsButtonClickHandler}
        >
          Изменить
        </button>
      </div>

      <div className="flex gap-10 mt-5">
        <div className="max-w-[470px] flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#0D141C]">
            Созданные команды
          </h2>
          <p className="text-base text-[#637087]">
            Для добавления участников в команды вы можете использовать
            выпадающий список или переместить свободных участников в команды с
            помощью drag and drop
          </p>
          {teams.map((teamName) => (
            <DragContainer
              key={teamName.id}
              teamName={teamName.name}
              func={setTeamMembers}
              team={teamMembers}
            />
          ))}
        </div>

        <div className="max-w-[470px] flex flex-col gap-3">
          <h2 className="text-lg font-bold text-[#0D141C]">
            Свободные участники
          </h2>

          <div className="relative flex items-center mb-4">
            <svg
              className="absolute transform -translate-y-1/2 left-2 top-1/2"
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.0306 18.9694L15.3366 14.2762C18.1629 10.883 17.8204 5.86693 14.5591 2.88935C11.2978 -0.0882368 6.27134 0.0259986 3.14867 3.14867C0.0259986 6.27134 -0.0882368 11.2978 2.88935 14.5591C5.86693 17.8204 10.883 18.1629 14.2762 15.3366L18.9694 20.0306C19.2624 20.3237 19.7376 20.3237 20.0306 20.0306C20.3237 19.7376 20.3237 19.2624 20.0306 18.9694ZM2.25 9C2.25 5.27208 5.27208 2.25 9 2.25C12.7279 2.25 15.75 5.27208 15.75 9C15.75 12.7279 12.7279 15.75 9 15.75C5.27379 15.7459 2.25413 12.7262 2.25 9Z"
                fill="#637087"
              />
            </svg>

            <input
              type="text"
              placeholder="Поиск"
              className="w-full py-2 pl-10 pr-2 bg-[#f0f2f5] rounded-lg"
              value={searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className="rounded-[10px] border border-dashed border-[#637087] py-3 px-6 flex flex-wrap">
            {searchResults.map((index) => (
              <DragElement key={index.index} data={index} />
            ))}
          </div>

          <div className="flex justify-end">
            <button className="text-white bg-[#1a5ce5] py-2 px-4 rounded-xl">
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTeamsPage;
