import { FC, useState, useRef, useEffect } from 'react';

interface KanbanColumnMenuProps {
  onRename: () => void;
  onDelete: () => void;
}

const KanbanColumnMenu: FC<KanbanColumnMenuProps> = ({
  onRename,
  onDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null); // Ссылка на компонент меню

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  // Закрытие меню при клике вне области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

  return (
    <div className="relative" ref={menuRef}>
      {/* Кнопка для открытия меню */}
      <button
        onClick={toggleMenu}
        className="p-2 rounded-full hover:bg-gray-200"
      >
        &#x22EE; {/* Юникод для трех вертикальных точек */}
      </button>

      {/* Меню */}
      {isOpen && (
        <div
          className="absolute left-0 w-40 mt-2 bg-white border rounded shadow-lg"
          onBlur={closeMenu}
        >
          <ul className="py-1">
            <li>
              <button
                onClick={() => {
                  onRename();
                  closeMenu();
                }}
                className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100"
              >
                Переименовать
              </button>
            </li>

            <li>
              <button
                onClick={() => {
                  onDelete();
                  closeMenu();
                }}
                className="block w-full px-4 py-2 text-left text-red hover:text-dark_red"
              >
                Удалить
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default KanbanColumnMenu;
