import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserDto } from '../dtos/user.dto';
import { UserSession } from '../../commons/decorators/user.decorator';
import { User } from '@prisma/client';
import { UserAuthGuard } from '../guards/user-auth.guard';
import { UserLoginResponse } from '../../commons/types/user-login-response.type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(UserAuthGuard)
  @Post('sign-in')
  async signIn(
    @Body() body: UserDto,
    @UserSession() user: User,
  ): Promise<UserLoginResponse> {
    return this.authService.signIn(user.email, user.id);
  }

  @Post('sign-up')
  async signUp(@Body() body: UserDto): Promise<UserLoginResponse> {
    return this.authService.signUp(body);
  }
}
