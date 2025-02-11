import { User } from '@prisma/client';

export interface UsersRepositoryInterface {
  createUser(data: { email: string; password: string }): Promise<User>;
  findUsers(): Promise<User[]>;
  findUserByParams(params: Partial<User>): Promise<User | null>;
}
