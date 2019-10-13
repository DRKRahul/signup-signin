import sha from 'sha.js';

export default class AuthHelper {
  constructor() {}

  static async generateRefreshToken(username, password) {
    if (!username || !password) {
      throw new Error('Invalid input for generating refresh token.');
    }

    const sha256 = sha('sha256');
    return await sha256.update(`${password}${Math.random()}${username}`, 'utf8').digest('hex');
  }
}
