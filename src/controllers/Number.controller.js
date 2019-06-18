import NumberModel from '../models/Number.model';

const model = new NumberModel();

/**
 * @class NumberController
 */
export default class NumberController {
  /**
   * @method generate
   *
   * @param {object} req request
   * @param {object} res response
   *
   * @returns {object} json object
   */
  static generate = async (req, res) => {
    const { sort, count } = req.query;
    const numbers = await model.getNumbers(count, sort);
    const { length } = numbers;

    const min = (!sort || sort === 'ASC') ? numbers[0] : numbers[length - 1];
    const max = (!sort || sort === 'ASC') ? numbers[length - 1] : numbers[0];

    return res.status(201).json({
      data: {
        numbers, min, max, length
      }
    });
  }

  /**
   * @method download
   *
   * @param {object} req request
   * @param {object} res response
   *
   * @returns {object} json object
   */
  static download = async (req, res) => res.status(200).download('./database/numbers.txt')
}
