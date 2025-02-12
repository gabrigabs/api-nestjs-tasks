import { User } from '@prisma/client';

export interface UserLoginResponse {
  accessToken: string;
}

export type UserWithoutPassword = Omit<User, 'password'>;
