import jwt from 'jsonwebtoken';

export const user = {
  userId: 'userId',
  password: 'password'
}

export const userWithWrongPassword = {
  userId: 'userId',
  password: 'passwordtest'
}

export const unexistingUser = {
  userId: 'test',
  password: 'password'
}

export const token = jwt.sign(
  {
    userId: 'userId'
  },
  process.env.JWT_SECRET,
  { expiresIn: '4h' },
);

export const expiredToken = jwt.sign(
  {
    userId: 'userId'
  },
  process.env.JWT_SECRET,
  { expiresIn: '100ms' },
);

export const badToken = jwt.sign(
  {
    userId: 'userId'
  },
  'process.env.JWT_SECRET',
  { expiresIn: '2h' },
);

export const wrongUserToken = jwt.sign(
  {
    userId: 'test'
  },
  process.env.JWT_SECRET,
  { expiresIn: '2h' },
);
