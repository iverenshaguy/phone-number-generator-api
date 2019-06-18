import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import UserModel from '../models/User.model';

config();

const model = new UserModel();

/**
 * @class Authentication
 */
export default class Authentication {
  /**
   * @method getMessage
   *
   * @param {object} user user
   *
   * @returns {string} token
   */
  static generateToken(user) {
    const { userId } = user;

    return jwt.sign(
      {
        userId
      },
      process.env.JWT_SECRET,
      { expiresIn: '4h' },
    );
  }

  /**
   * @method getToken
   *
   * @param {object} req request
   *
   * @returns {string} token
   */
  static getToken(req) {
    const bearerToken = req.headers.authorization;
    const token = bearerToken && bearerToken.replace('Bearer ', '');

    return token;
  }

  /**
   * @method authenticate
   *
   * @param {object} req request
   * @param {object} res response
   * @param {function} next next
   *
   * @returns {function} next() or JSON response
   */
  static authenticate(req, res, next) {
    const token = Authentication.getToken(req);

    if (!token) {
      return res.status(401)
        .json({ status: 401, error: 'User authentication token is required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401)
            .json({ status: 401, error: 'User authentication token is expired' });
        }

        return res.status(401).json({ status: 401, error: 'Failed to authenticate token' });
      }
      const { userId } = decoded;
      const user = await model.getUser(userId);

      if (!user) {
        return res.status(401)
          .json({ status: 401, error: 'Failed to authenticate token' });
      }

      req.auth = { userId };

      next();
    });
  }
}
