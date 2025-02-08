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
    .replace(',', ''); // Удаляем запятую между датой и временем
};

export {
  transformSeparateDateAndTimeToISO,
  getISODateInUTC3,
  getISODateTimeInUTC3,
  getTimeFromDate,
};
