import { Body, Controller, Post, UseGuards, Logger } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserDto } from '../dtos/user.dto';
import { UserSession } from '../../commons/decorators/user.decorator';
import { User } from '@prisma/client';
import { UserAuthGuard } from '../guards/user-auth.guard';
import { UserLoginResponse } from '../../commons/interfaces/user.interface';
import { AuthControllerInterface } from './auth.controller.interface';

@Controller('auth')
export class AuthController implements AuthControllerInterface {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @UseGuards(UserAuthGuard)
  @Post('sign-in')
  async signIn(@UserSession() user: User): Promise<UserLoginResponse> {
    this.logger.log(`User signing in: ${user.email}`);
    const response = await this.authService.signIn(user.email, user.id);
    this.logger.log(`User ${user.email} signed in successfully`);
    return response;
  }

  @Post('sign-up')
  async signUp(@Body() body: UserDto): Promise<UserLoginResponse> {
    this.logger.log(`New user signing up with email: ${body.email}`);
    const response = await this.authService.signUp(body);
    this.logger.log(`User ${body.email} signed up successfully`);
    return response;
  }
}
