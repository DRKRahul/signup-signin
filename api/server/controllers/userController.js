import moment from 'moment';
import sha from 'sha.js';

import UserService from '../services/userService';
import ErrorUtil from '../utils/errorUtility';
import AuthHelper from '../utils/authHelper';

const errorUtil = new ErrorUtil();

class UserController {
  static async getAllUsers(req, res) {
    try {
      const allUsers = await UserService.getAllUsers();
      if (allUsers.length > 0) {
        errorUtil.setSuccess(200, 'Users retrieved', allUsers);
      } else {
        errorUtil.setSuccess(200, 'No User found');
      }
      return errorUtil.send(res);
    } catch (error) {
      errorUtil.setError(400, error);
      return errorUtil.send(res);
    }
  }

  static async addUser(req, res) {
    if (!req.body.hobbies || !req.body.email || !req.body.name || !req.body.password || !req.body.gender ) {
      errorUtil.setError(400, 'Please provide complete details');
      return errorUtil.send(res);
    }
    try {
      const newUser = req.body;
      const creds = {
        email: newUser.email,
        password: await sha('sha256').update(newUser.password, 'utf8').digest('hex'),
        refreshToken: await AuthHelper.generateRefreshToken(newUser.email,newUser.password),
        tokenExpiry: moment(new Date()).add('days', parseInt(process.env.TOKEN_EXPIRY,10))
      }
      await UserService.addUserCreds(creds);
      const createdUser = await UserService.addUserDetails(newUser);
      errorUtil.setSuccess(201, 'User Added!', createdUser);
      return errorUtil.send(res);
    } catch (error) {
      errorUtil.setError(500, error.message);
      return errorUtil.send(res);
    }
  }
}

export default UserController;