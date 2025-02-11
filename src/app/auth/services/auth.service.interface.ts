import { User } from '@prisma/client';
import { UserDto } from '../dtos/user.dto';
import { UserLoginResponse } from 'src/app/commons/interfaces/user.interface';

export interface AuthServiceInterface {
  validateUser({
    email,
    password,
  }: UserDto): Promise<Omit<User, 'password'> | null>;
  signUp(user: UserDto): Promise<UserLoginResponse>;
  signIn(email: string, id: string): Promise<UserLoginResponse>;
}
