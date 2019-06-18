import UserModel from '../models/User.model';
import Authentication from '../middlewares/Authentication.middleware';

const model = new UserModel();

/**
 * @class AuthController
 */
export default class AuthController {
  /**
   * @method siginin
   *
   * @param {object} req request
   * @param {object} res response
   *
   * @returns {object} json object
   */
  static async signin(req, res) {
    const { userId, password } = req.body;
    const user = await model.getUser(userId);

    if (!user || (user && user.password !== password)) {
      return res.status(401).json({ status: 401, error: 'Invalid credentials' });
    }

    const token = Authentication.generateToken(user);

    return res.status(200).json({ status: 200, data: { token } });
  }
}
