import { User } from '@prisma/client';

export interface UsersRepositoryInterface {
  addUser(data: { email: string; password: string }): Promise<User>;
  getUsers(): Promise<User[]>;
}
