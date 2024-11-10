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

const getISODateInUTC3 = (date: Date): string => {
  return date
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

export { transformSeparateDateAndTimeToISO, getISODateInUTC3, getTimeFromDate };
