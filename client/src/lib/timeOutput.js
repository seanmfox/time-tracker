export const timeOutput = time => {
  const dbTime = Number(time);
  if (dbTime < 1) {
    return `${dbTime * 60} mins`;
  } else if (dbTime === 1) {
    return "1 hr";
  } else if (dbTime % 1 === 0) {
    return `${dbTime} hrs`;
  } else {
    const parsedTime = dbTime.toString().split(".");
    const hours = Number(parsedTime[0]);
    const minutes = Number(`.${parsedTime[1]}`) * 60;
    if (hours === 1) {
      return `1 hr, ${minutes} mins`;
    } else {
      return `${hours} hrs, ${minutes} mins`;
    }
  }
};
