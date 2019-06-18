/**
 * Generate a 10 digit number
 *
 * @returns {number} the number
 */
const generateNumber = () => `0${Math.floor(Math.random() * Number('9'.padEnd(9, 0)))
  + Number('1'.padEnd(9, 0))}`;

export default generateNumber;
