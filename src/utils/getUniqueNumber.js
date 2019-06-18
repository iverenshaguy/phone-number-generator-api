import generateNumber from './generateNumber';

/**
 * Generate a 10 digit unique number
 *
 * @param {Buffer} prevData previous data gotten
 *
 * @returns {number} the unique number
 */
const getUniqueNumber = (prevData) => {
  const uniqueNumber = generateNumber();
  const exists = prevData.toString().includes(uniqueNumber);

  if (exists) return getUniqueNumber(prevData);

  return uniqueNumber;
};

export default getUniqueNumber;
