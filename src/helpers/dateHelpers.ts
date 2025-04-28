const transformSeparateDateAndTimeToISO = (
  date: string,
  time: string
): string => {
  return `${date}T${time}:00`;
};

const getTimeFromDate = (date: Date): string => {
  const hours: string =
    date.getHours() < 10 ? `0${date.getHours()}` : date.getHours().toString();
  const minutes: string =
    date.getMinutes() < 10
      ? `0${date.getMinutes()}`
      : date.getMinutes().toString();

  return `${hours}:${minutes}`;
};

const getEventDateDisplayString = (
  startDate: Date,
  finishDate: Date
): string => {
  if (startDate.getDate() === finishDate.getDate()) {
    return `${getTimeFromDate(startDate)} - ${getTimeFromDate(
      finishDate
    )} ${startDate.toLocaleDateString()}`;
  } else {
    return `${startDate.toLocaleDateString()}  ${getTimeFromDate(
      startDate
    )} - ${finishDate.toLocaleDateString()}  ${getTimeFromDate(finishDate)}`;
  }
};

const getISODateInUTC3 = (date: string | Date): string => {
  // Преобразуем строку в объект Date, если это строка
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return parsedDate
    .toLocaleDateString('en-GB', {
      timeZone: 'Europe/Moscow',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .split('/')
    .reverse()
    .join('-');
};

const getISODateTimeInUTC3 = (date: string | Date): string => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;

  // Смещаем время на UTC+3
  const offset = 3 * 60 * 60 * 1000; // 3 часа в миллисекундах
  const dateInUTC3 = new Date(parsedDate.getTime() + offset);

  // Преобразуем в ISO-формат без Z-суффикса
  return dateInUTC3.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
};

const getDateTimeDisplay = (date: string | Date): string => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;

  // Используем Intl.DateTimeFormat для объединения даты и времени
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
    .format(parsedDate)
    .replace(',', '');
};

const addOneDay = (date: Date): Date => {
  const newDate = new Date(date); // Создаём новый объект, чтобы не мутировать исходный
  newDate.setDate(newDate.getDate() + 1); // Увеличиваем день на 1
  return newDate;
};

const MONTHS_GENITIVE = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
];

const getRussianDateDisplay = (date: Date): string => {
  return `${date.getDate()} ${
    MONTHS_GENITIVE[date.getMonth()]
  }, ${date.getFullYear()}`;
};

export {
  transformSeparateDateAndTimeToISO,
  getISODateInUTC3,
  getISODateTimeInUTC3,
  getDateTimeDisplay,
  getTimeFromDate,
  getEventDateDisplayString,
  addOneDay,
  getRussianDateDisplay,
};
