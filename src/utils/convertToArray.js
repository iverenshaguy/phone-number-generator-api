/**
 * Convert a string of comma separated numbers to array
 *
 * @param {string} string array string
 *
 * @returns {array} array of numbers
 */
const convertToArray = (string) => {
  const arr = string.split(',');
  return arr.filter(item => item);
};

export default convertToArray;
