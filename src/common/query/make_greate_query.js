function likeClause(row, value) {
  return value ? `${row} like '%${value}%' and` : "";
}
function equalClause(row, value) {
  return value ? `${row} = ${value} and` : "";
}
function timeClause(row, value1, value2) {
  return value1 && value2 ? `DATE(${row}) between '${value1}' and '${value2}' and` : "";
}
function removeLastAnd(value) {
  var index = value.trim().lastIndexOf(" ");
  return value.substring(0, index);
}
module.exports = {
  likeClause,
  removeLastAnd,
  equalClause,
  timeClause
};
