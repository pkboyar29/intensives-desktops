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

export { transformISODateToTime, transformSeparateDateAndTimeToISO };
