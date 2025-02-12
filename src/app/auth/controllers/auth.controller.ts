import { Body, Controller, Post, UseGuards, Logger } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserRequestDto } from '../dtos/requests/user-request.dto';
import { UserSession } from '../../commons/decorators/user.decorator';
import { User } from '@prisma/client';
import { UserAuthGuard } from '../guards/user-auth.guard';
import { AuthControllerInterface } from './auth.controller.interface';
import { UserLoginResponseDto } from '../dtos/responses/user-login.response.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController implements AuthControllerInterface {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'Sign in',
    description: 'Signs in a user and gets a JWT token',
  })
  @ApiBody({ type: UserRequestDto })
  @ApiCreatedResponse({ type: UserLoginResponseDto })
  @ApiBadRequestResponse({ description: 'Validation Error' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credentials' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @UseGuards(UserAuthGuard)
  @Post('sign-in')
  async signIn(@UserSession() user: User): Promise<UserLoginResponseDto> {
    this.logger.log(`User signing in: ${user.email}`);
    const response = await this.authService.signIn(user.email, user.id);
    this.logger.log(`User ${user.email} signed in successfully`);
    return response;
  }

  @ApiOperation({
    summary: 'Sign up',
    description: 'Signs up a new user and gets a JWT token',
  })
  @ApiBody({ type: UserRequestDto })
  @ApiCreatedResponse({ type: UserLoginResponseDto })
  @ApiBadRequestResponse({ description: 'Validation Error' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('sign-up')
  async signUp(@Body() body: UserRequestDto): Promise<UserLoginResponseDto> {
    this.logger.log(`New user signing up with email: ${body.email}`);
    const response = await this.authService.signUp(body);
    this.logger.log(`User ${body.email} signed up successfully`);
    return response;
  }
}
