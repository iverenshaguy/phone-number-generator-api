/**
 * Sort an array of numbers
 *
 * @param {array} numbers numbers
 * @param {string} sort ASC or DESC
 *
 * @returns {array} array of sorted numbers
 */
const sortNumbers = (numbers, sort = 'ASC') => {
  if (sort === 'ASC') {
    return numbers.sort();
  }

  return numbers.sort((a, b) => b - a);
};

export default sortNumbers;
