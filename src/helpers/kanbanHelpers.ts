import { ITaskPositionUpdate } from '../ts/interfaces/ITask';

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
  // Можно сделать общей не только для канбана
  const regex = /^[a-zA-Zа-яА-Я0-9.,!?@#%&*()_+=\-/\\:;"'<>[\]{}|`~\s]+$|^$/; // Регулярка для разрешенных символов

  if (!regex.test(name)) {
    return false;
  }
  return true;
};

export function useCombinedRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return (node: T) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref && typeof ref === 'object') {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    }
  };
}

export const getPayloadForUpdatingTaskPosition = (
  info: ITaskPositionUpdate
) => {
  const payload = {
    id: info.id,
    position: info.position, // Новая позиция
    column: info.column !== null ? undefined : info.column, // Если есть подзадача не отправляем колонку (нет смысла)
    parentTask: info.parentTask !== null ? info.parentTask : undefined,
  };
  console.log(payload);

  return payload;
};
