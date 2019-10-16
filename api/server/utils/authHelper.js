import sha from 'sha.js';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
// use 'utf8' to get string instead of byte array  (512 bit key)
const privateKEY  = fs.readFileSync(path.join(__dirname,'private.key'), 'utf8');
const publicKEY  = fs.readFileSync(path.join(__dirname,'public.key'), 'utf8');

export default class AuthHelper {
  constructor() {}

  static async generateRefreshToken(username, password) {
    if (!username || !password) {
      throw new Error('Invalid input for generating refresh token.');
    }

    const sha256 = sha('sha256');
    return await sha256.update(`${password}${Math.random()}${username}`, 'utf8').digest('hex');
  }

  static async signAccessToken(payload, clientId) {
    // Token signing options
    var signOptions = {
        issuer:  'centralPerk.com',
        subject:  'signup-signin',
        audience: clientId,
        expiresIn:  process.env.JWT_EXPIRY,
        algorithm:  "RS256"    
    };
    return await jwt.sign(payload, privateKEY, signOptions);
  };

  static async verifyAccessToken(token, clientId) {
    var verifyOptions = {
        issuer:  'centralPerk.com',
        subject:  'signup-signin',
        audience:  clientId,
        expiresIn:  process.env.JWT_EXPIRY,
        algorithm:  ["RS256"]
    };
    try{
      return jwt.verify(token, publicKEY, verifyOptions);
    }catch (err){
      return false;
    }
  };
}
