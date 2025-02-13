import { User } from '@prisma/client';
import { UserRequestDto } from '../dtos/requests/user-request.dto';
import { UserLoginResponseDto } from '../dtos/responses/user-login.response.dto';

export interface AuthControllerInterface {
  signIn(user: User): Promise<UserLoginResponseDto>;
  signUp(body: UserRequestDto): Promise<UserLoginResponseDto>;
}
