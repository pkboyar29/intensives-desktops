import { FC, useState, useRef, useEffect } from 'react';
import { KANBAN_COLORS } from '../helpers/kanbanHelpers';

interface KanbanColumnMenuProps {
  onRename: () => void;
  onChangeColor: (color: string) => void;
  onDelete: () => void;
}

const KanbanColumnMenu: FC<KanbanColumnMenuProps> = ({
  onRename,
  onChangeColor,
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
          className="absolute left-0 mt-2 bg-white border rounded shadow-lg w-60"
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

            <div className="my-2 border-t border-gray-300"></div>

            <li>
              <h3 className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100">
                Цвет колонки
              </h3>
              <div className="grid grid-cols-8 gap-1 px-4">
                {KANBAN_COLORS.map((color) => (
                  <button
                    key={color}
                    className={`w-5 h-5 rounded-full border`}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      onChangeColor(color);
                      closeMenu();
                    }}
                  />
                ))}
              </div>
            </li>

            <div className="my-2 border-t border-gray-300"></div>

            <li>
              <button
                onClick={() => {
                  onDelete();
                  closeMenu();
                }}
                className="block w-full px-4 py-2 text-left text-red hover:text-dark_red"
              >
                Удалить колонку
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default KanbanColumnMenu;
