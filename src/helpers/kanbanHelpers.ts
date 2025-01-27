
export const KANBAN_COLORS = [
    '#1a5ce5', // синий
    '#2ac7d8', // бирюзовый
    '#6fd0a9', // мятный
    '#a2d729', // лаймовый
    '#f7c346', // желтый
    '#ff8a30', // оранжевый
    '#ff6f61', // коралловый
    '#e53e3e', // красный
    '#9752e3', // фиолетовый
    '#c085ff', // сиреневый
    '#f78fb3', // розовый
    '#4ca9ff', // голубой
    '#3a915f', // темно-зеленый
    '#8a8a8a', // обновленный серый
    '#d9d9d9', // светло-серый
];

export const validateKanban = (name: string): boolean => {
    const regex = /^[a-zA-Zа-яА-Я0-9 _-]+$/; // Регулярка для разрешенных символов
    if(name.trim() === '') {
      return false;
    }
    if(!regex.test(name)) {
      return false;
    }
    return true;
};