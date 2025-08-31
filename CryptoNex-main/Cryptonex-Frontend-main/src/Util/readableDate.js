export function readableDate(dateString) {
  // Parse the input string to create a Date object
  const date = new Date(dateString);

  // Format the date components for Indian format: DD/MM/YYYY
  const day = ('0' + date.getDate()).slice(-2);
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  // Get hours in 24-hour format and convert to 12-hour format
  const hours24 = date.getHours();
  const hour12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const formattedHour = ('0' + hour12).slice(-2);
  const period = hours24 < 12 ? 'AM' : 'PM';

  // Format minutes and seconds
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);
  const formattedTime = `${formattedHour}:${minutes}:${seconds} ${period}`;

  return { date: formattedDate, time: formattedTime };
}
