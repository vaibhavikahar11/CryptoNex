export const readableTimestamp = (timestamp) => {
  const date = new Date(timestamp);

  const options = {
    timeZone: "Asia/Kolkata", // Convert to Indian Standard Time (IST)
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Use 24-hour format; change to true if 12-hour format is preferred
  };

  const formattedDate = date.toLocaleString("en-IN", options);
  return formattedDate;
};
