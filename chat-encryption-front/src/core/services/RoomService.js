export const getRoomName = function(username1, username2) {
  const temp = [username1, username2];
  temp.sort();
  return temp[1] + "_" + temp[0];
};
