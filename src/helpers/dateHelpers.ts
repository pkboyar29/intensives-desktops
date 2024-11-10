const transformISODateToTime = (isoDate: string): string => {
  const dateObj = new Date(isoDate);
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const transformSeparateDateAndTimeToISO = (
  date: string,
  time: string
): string => {
  return `${date}T${time}:00`;
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

export {
  transformISODateToTime,
  transformSeparateDateAndTimeToISO,
  getISODateInUTC3,
};
