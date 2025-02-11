import { User } from '@prisma/client';
import { UserLoginResponse } from '../../commons/interfaces/user.interface';
import { UserDto } from '../dtos/user.dto';

export interface AuthControllerInterface {
  signIn(user: User): Promise<UserLoginResponse>;
  signUp(body: UserDto): Promise<UserLoginResponse>;
}
