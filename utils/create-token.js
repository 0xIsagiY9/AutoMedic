import jwt from 'jsonwebtoken';

const createToken = (payload) => {
  return jwt.sign({ id: payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export default createToken;
