import { FC, useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

interface KanbanTaskMenuProps {
  onRename: () => void;
  onCreateSubtask?: () => void;
  onDelete: () => void;
}

const KanbanTaskMenu: FC<KanbanTaskMenuProps> = ({
  onRename,
  onCreateSubtask,
  onDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null); // Ссылка на компонент меню
  const buttonRef = useRef<HTMLButtonElement>(null); // Ссылка на кнопку меню

  const toggleMenu = () => {
    //setIsOpen((prev) => !prev);

    // Рассчет позицию меню (можно ли проверять !isOpen тут?)
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

  const menuContent = (
    <div
      ref={menuRef}
      style={{
        position: 'absolute',
        top: menuPosition.top,
        left: menuPosition.left,
        zIndex: 1000,
      }}
      className="absolute left-0 w-40 mt-2 bg-white border rounded shadow-lg"
      onBlur={closeMenu}
    >
      <ul className="py-1">
        <li>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Останавливаем всплытие ??
              onRename();
              closeMenu();
            }}
            className="block w-full px-4 py-2 text-left text-black duration-100 hover:text-blue"
          >
            Переименовать
          </button>
        </li>

        <div className="my-2 border-t border-gray-300"></div>

        {onCreateSubtask && (
          <>
            <li>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateSubtask();
                  closeMenu();
                }}
                className="block w-full px-4 py-2 text-left text-black duration-100 hover:text-blue"
              >
                Создать подзадачу
              </button>
            </li>
            <div className="my-2 border-t border-gray-300"></div>
          </>
        )}

        <li>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
              closeMenu();
            }}
            className="block w-full px-4 py-2 text-left duration-100 text-red hover:text-dark_red"
          >
            Удалить задачу
          </button>
        </li>
      </ul>
    </div>
  );

  return (
    <div className="relative">
      {/* Кнопка для открытия меню */}
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="rounded-full hover:text-blue"
      >
        &#x22EE; {/* Юникод для трех вертикальных точек */}
      </button>

      {/* Рендерим меню через портал */}
      {isOpen && ReactDOM.createPortal(menuContent, document.body)}
    </div>
  );
};

export default KanbanTaskMenu;
