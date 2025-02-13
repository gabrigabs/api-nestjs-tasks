import { User } from '@prisma/client';

export const userMock: User = {
  id: '1',
  email: 'test@example.com',
  password: 'hashedPassword123',
};

export const createUserMock = {
  email: 'test@example.com',
  password: 'password123',
};

export const loginOrRegisterMock = {
  email: 'test@example.com',
  password: 'password123',
};

export const signResponseMock = {
  accessToken: 'mock.jwt.token',
};
