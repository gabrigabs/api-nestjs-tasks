import { UserDto } from '../dtos/user.dto';
import {
  UserLoginResponse,
  UserWithoutPassword,
} from '../../commons/interfaces/user.interface';

export interface AuthServiceInterface {
  validateUser({
    email,
    password,
  }: UserDto): Promise<UserWithoutPassword | null>;
  signUp(user: UserDto): Promise<UserLoginResponse>;
  signIn(email: string, id: string): Promise<UserLoginResponse>;
}
