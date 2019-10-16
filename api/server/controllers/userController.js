import moment from 'moment';
import sha from 'sha.js';

import UserService from '../services/userService';
import ErrorUtil from '../utils/errorUtility';
import AuthHelper from '../utils/authHelper';
import Emailer from '../utils/emailer';

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
    if (!req.body.hobbies || !req.body.email || !req.body.name || !req.body.password || !req.body.gender) {
      errorUtil.setError(400, 'Please provide complete details');
      return errorUtil.send(res);
    }
    try {
      const newUser = req.body;
      const refreshToken = await AuthHelper.generateRefreshToken(newUser.email, newUser.password);
      const email = newUser.email;
      const creds = {
        email,
        refreshToken,
        password: await sha('sha256').update(newUser.password, 'utf8').digest('hex'),
        tokenExpiry: moment(new Date()).add(parseInt(process.env.TOKEN_EXPIRY, 10), 'days')
      }
      await UserService.addUserCreds(creds);
      const createdUser = await UserService.addUserDetails(newUser);
      const emailer = new Emailer();
      await emailer.sendVerificationMail(email, refreshToken);
      errorUtil.setSuccess(200, 'User Added!', createdUser);
      return errorUtil.send(res);
    } catch (error) {
      errorUtil.setError(500, error.message);
      return errorUtil.send(res);
    }
  }

  static async verifyEmail(req, res) {
    try {
      const userToken = req.query.id;
      if (!userToken) {
        errorUtil.setError(400, 'Bad Request');
        return errorUtil.send(res);
      }
      const creds = await UserService.findCredsCustom('refreshToken', userToken);
      const {
        id,
        refreshToken,
        tokenExpiry,
        isActive
      } = creds;
      if (isActive) {
        res.redirect(process.env.HOMEPAGE);
      }

      if (moment(tokenExpiry).diff(moment(), 'days') < 0) {
        res.end('<h1>Link Expired</h1>')
      }

      if (!refreshToken === userToken) {
        res.end('<h1>Bad Request! Your email could not be verified</h1>');
      }
      await UserService.changeCreds(id, {
        isActive: true
      });
      res.end(`
        <h1>Your email has been verified successfully</h1>
        <br>
        <a href="${process.env.HOMEPAGE}">Click here to login</a>
      `);
    } catch (e) {
      errorUtil.setError(500, error.message);
      return errorUtil.send(res);
    }
  }

  static async loginUser(req, res) {
    try {
      const {
        email,
        password
      } = req.body;
      const {
        remoteAddress
      } = req.socket;
      const userData = await UserService.findCredsCustom('email', email);
      if (!userData || !userData.isActive) {
        errorUtil.setError(403, `Not a verified user`);
        return errorUtil.send(res);
      }
      let loginPassword = await sha('sha256').update(password, 'utf8').digest('hex');
      if (loginPassword !== userData.password) {
        errorUtil.setError(403, `Bad Credentials`);
        return errorUtil.send(res);
      }

      const refreshToken = await AuthHelper.generateRefreshToken(email, password);
      const accessToken = await AuthHelper.signAccessToken({email}, remoteAddress);
      await UserService.changeCreds(userData.id, {
        refreshToken,
        tokenExpiry: moment(new Date()).add(parseInt(process.env.TOKEN_EXPIRY, 10), 'days')
      })
      const responseToken = {
        refreshToken,
        accessToken
      };
      errorUtil.setSuccess(200, 'User Logged In', responseToken);
      errorUtil.send(res);
    } catch (err) {
      console.log(err,"-----");
      errorUtil.setError(500, error.message);
      return errorUtil.send(res);
    }
  }
  static async validateToken() {
    
  }
}

export default UserController;