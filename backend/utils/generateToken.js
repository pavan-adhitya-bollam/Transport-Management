import jwt from 'jsonwebtoken';
import { jwtSecret, jwtExpire } from '../config/config.js';

export const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: jwtExpire,
  });
};
