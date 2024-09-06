import DragElement from '../components/DragComponents/DragElement';
import { useState, useEffect } from 'react';
import SideMenu from '../components/SideMenu';
import DragContainer from '../components/DragComponents/DragContainer';
import Modal from '../components/ModalWindow';

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

const TEAM_NAMES = [
  { id: 'Команда1', name: 'Команда 1' },
  { id: 'Команда2', name: 'Команда 2' },
];

function CreateCommand() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [countTeams, setCountTeams] = useState(2);
  const [teams, setTeams] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setTeamMembers(base);
    setTeams(TEAM_NAMES);
    setSearchResults(teamMembers);
  }, []);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    if (searchTerm)
      setSearchResults(
        teamMembers.filter((item) =>
          item.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    else setSearchResults(teamMembers);
  }, [searchTerm, teamMembers]);

  const handleModalClose = (option) => {
    setIsModalOpen(false);
    let massTeam = [];
    for (let i = 1; i <= countTeams; i++) {
      massTeam.push({ id: `Команда` + i, name: `Команда ${i}` });
    }
    setTeams(massTeam);
  };

  return (
    <div className="body">
      <SideMenu />
      <div className="main-block">
        <div className="center-block">
          <div className="min-h-screen font-roboto">
            <Modal isOpen={isModalOpen} onClose={handleModalClose} />

            <div className="flex items-center justify-between max-w-6xl mx-auto">
              <div className="title">
                <div className="font-32">Команды</div>
                <p className="text-sm text-[#6B7280]">
                  Создайте команды и распределите участников интенсива по
                  командам
                </p>
              </div>
            </div>

            <div className="max-w-6xl p-6 mx-auto space-y-6">
              <div className="flex flex-row items-center mb-4 space-x-2">
                <input
                  type="number"
                  onChange={(e) => {
                    setCountTeams(+e.target.value);
                  }}
                  className="w-12 p-2 border border-[#D1D5DB] rounded-md text-center"
                  value={countTeams}
                />
                <button
                  type="button"
                  className="button-classic"
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                >
                  Изменить
                </button>
              </div>
              <div className="flex gap margin-top">
                <div>
                  <div className="left-column-command">
                    <h2 className="text-lg font-bold text-[#333]">
                      Созданные команды
                    </h2>
                    <p className="text-sm text-[#6B7280]">
                      Для добавления участников в команды вы можете использовать
                      выделенный список или переместить свободных участников в
                      команды с помощью drag and drop
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
                </div>
                <div>
                  <div className="p-6 bg-white container-free-students">
                    <h2 className="mb-4 text-lg font-bold">
                      Свободные участники
                    </h2>
                    <div className="flex items-center mb-4 search-full-screen">
                      <i className="fa fa-search text-[#6B7280]"></i>
                      <input
                        type="text"
                        placeholder="Поиск"
                        className="w-full p-2 border-0"
                        value={searchTerm}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="container-free-students-list">
                        {searchResults.map((index) => (
                          <DragElement
                            key={index.index}
                            data={index}
                            selectedMembers={selectedMembers}
                            setSelectedMembers={setSelectedMembers}
                          ></DragElement>
                        ))}
                      </div>
                    </div>
                    <button className="button-classic">Сохранить</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCommand;
