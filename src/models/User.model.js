import { config } from 'dotenv';

config();

/**
 * @class UserModel
 */
export default class UserModel {
/**
 * @constructor
 */
  constructor() {
    this.user = {
      userId: process.env.USER_ID,
      password: process.env.USER_PASSWORD
    };
  }

  /**
   * Get authorised user
   *
   * @param {string} userId userId
   *
   * @returns {object|null} user
   */
  getUser = (userId) => {
    if (userId === this.user.userId) return this.user;

    return null;
  }
}
