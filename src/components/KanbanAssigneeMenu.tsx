import { FC, useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useAppSelector } from '../redux/store';

interface KanbanAssigneeMenuProps {
  onAddAssignee: (studentIds: number[]) => void;
  addedAssignee?: number[];
  isVisibleButton?: boolean;
  onDelete?: () => void;
}

const KanbanAssigneeMenu: FC<KanbanAssigneeMenuProps> = ({
  onAddAssignee,
  addedAssignee,
  isVisibleButton = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null); // Ссылка на компонент меню
  const buttonRef = useRef<HTMLButtonElement>(null); // Ссылка на кнопку меню
  const currentTeam = useAppSelector((state) => state.team.data);

  // Закрытие меню при клике вне области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) && // Если клик не внутри меню
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Закрытие меню при прокрутке
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        closeMenu();
      }
    };

    if (isOpen) {
      // Обработчик для всего окна
      window.addEventListener('scroll', handleScroll, true); // true — для захвата событий
    } else {
      window.removeEventListener('scroll', handleScroll, true);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY - 20, // Верхняя координата
        left: rect.left + window.scrollX, // Левая координата
      });
    }

    setIsOpen((prev) => !prev);
  };
  const closeMenu = () => setIsOpen(false);

  const menuContent = (
    <div
      ref={menuRef}
      style={{
        position: 'absolute',
        top: menuPosition.top,
        left: menuPosition.left,
        zIndex: 1000,
      }}
      className="absolute left-0 mt-2 bg-white border rounded shadow-lg w-50" // сделать w вычислимым
      onBlur={closeMenu}
    >
      <ul className="py-1">
        {currentTeam &&
          currentTeam.studentsInTeam.map((student, index) => (
            <li key={index} className="border-t">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddAssignee([student.id!]);
                  closeMenu();
                }}
                className="block w-full px-4 py-2 my-2 text-left text-black duration-100 cursor-pointer hover:text-blue"
              >
                {student.student.user.lastName} {student.student.user.firstName}
              </button>
            </li>
          ))}
      </ul>
    </div>
  );

  return (
    <div className="relative">
      {/* Кнопка для открытия меню */}
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="text-xl duration-100 rounded-full hover:bg-white hover:text-dark_blue"
        title="Добавить исполнителей"
      >
        {isVisibleButton && '+'}
      </button>

      {/* Рендерим меню через портал */}
      {isOpen && ReactDOM.createPortal(menuContent, document.body)}
    </div>
  );
};

export default KanbanAssigneeMenu;
