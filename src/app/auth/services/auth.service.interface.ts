import { UserRequestDto } from '../dtos/requests/user-request.dto';
import { UserWithoutPassword } from '../../commons/interfaces/user.interface';
import { UserLoginResponseDto } from '../dtos/responses/user-login.response.dto';

export interface AuthServiceInterface {
  validateUser({
    email,
    password,
  }: UserRequestDto): Promise<UserWithoutPassword | null>;
  signUp(user: UserRequestDto): Promise<UserLoginResponseDto>;
  signIn(email: string, id: string): Promise<UserLoginResponseDto>;
}
