// Функция для преобразования строки в формате '2024-06-12' в формат '2024-06-05T23:39:35.003000+03:00'
function convertDateFormat(dateString) {
  const date = new Date(dateString);
  const isoString = date.toISOString();
  return isoString;
}

function formatDate(inputDate) {
  const parts = inputDate.split('-'); // Разбиваем входную дату по тире
  const year = parts[0]; // Получаем год
  const month = parts[1]; // Получаем месяц
  const day = parts[2]; // Получаем день

  return `${day}.${month}.${year}`; // Возвращаем дату в формате "день.месяц.год"
}

// Функция для преобразования строки в формате '2024-06-05T23:39:35.003000+03:00' в формат '2024-06-12'
function convertBackDateFormat(isoString) {
  const date = new Date(isoString);
  const dateString = date.toISOString().split('T')[0];
  return dateString;
}

function convertBackDateFormatDMY(isoString) {
  const date = new Date(isoString);
  // Извлекаем день, месяц и год
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  // Собираем все в нужном формате
  return `${day}-${month}-${year}`;
}

function filterNotIncludeObjectsByNames(objects, strings) {
  return objects.filter((obj) => !strings.includes(obj.name));
}

function filterIncludeObjectsByNames(objects, strings) {
  return objects.filter((obj) => strings.includes(obj.name));
}

export {
  convertDateFormat,
  convertBackDateFormat,
  filterNotIncludeObjectsByNames,
  filterIncludeObjectsByNames,
  formatDate,
  convertBackDateFormatDMY,
};
