const formatDate = (timestamp) => {
  const dateTime = new Date(timestamp * 1000);
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth();
  var date = dateTime.getDate();
  var hour = dateTime.getHours();
  var min = dateTime.getMinutes();
  
  return `${date}/${month}/${year} ${hour}:${min}`;
}

module.exports = { formatDate };