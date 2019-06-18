import fs from 'fs';

import generateUniqueNumbers from '../utils/generateUniqueNumbers';
import convertToArray from '../utils/convertToArray';
import sortNumbers from '../utils/sortNumbers';

const fsPromises = fs.promises;

/**
 * @class NumberModel
 */
export default class NumberModel {
  /**
   * Get authorised Number
   *
   * @param {number} count count
   * @param {sort} sort sort
   *
   * @returns {array} numbers
   */
  async getNumbers(count, sort) {
    await generateUniqueNumbers(count);
    const data = await fsPromises.readFile('./database/numbers.txt');
    const numbers = convertToArray(data.toString());

    return sortNumbers(numbers, sort);
  }
}
