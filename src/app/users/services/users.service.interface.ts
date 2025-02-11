import { User } from '@prisma/client';

export interface UsersServiceInterface {
  addUser(data: { email: string; password: string }): Promise<User>;
  getUsers(): Promise<User[]>;
  getUserByParams(params: Partial<User>): Promise<User | null>;
}
