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

  static async findCredsCustom(field, value) {
    try {
      const query = {};
      query[field] = value;
      const theUser = await db.user_credentials.findOne({
        where: query,
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

  static async changeCreds(id, body) {
    try {
      return await db.user_credentials.update(body, {
        where: {
          id
        }
      })
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;