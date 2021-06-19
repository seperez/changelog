const formatDate = (timestamp) => {
  const dateTime = new Date(timestamp * 1000);
  const year = dateTime.getFullYear();
  const month = dateTime.getMonth();
  const date = dateTime.getDate();
  const hour = dateTime.getHours();
  const min = dateTime.getMinutes();

  return `${date}/${month}/${year} ${hour}:${min}`;
};

module.exports = { formatDate };
