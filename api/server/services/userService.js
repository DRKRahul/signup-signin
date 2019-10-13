//import UserCredentials from '../src/models/user_credentials';
import db from '../src/models'

class UserService {
  static async addUserCreds(newUser) {
    try {
      return await db.user_credentials.create(newUser);
    } catch (error) {
      throw error;
    }
  }

  static async addUserDetails(newUser) {
    try {
      return await db.users.create(newUser);
    } catch (error) {
      throw error;
    }
  }

  static async getUserCreds(id) {
    try {
      const theUser = await db.user_credentials.findOne({
        where: {
          email: id
        }
      });
      return theUser;
    } catch (error) {
      throw error;
    }
  }

  static async getAllUsers() {
    try {
      return await db.users.findAll();
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;