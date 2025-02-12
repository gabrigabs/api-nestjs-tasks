import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import {
  UserLoginResponse,
  UserWithoutPassword,
} from '../../commons/interfaces/user.interface';
import { UserDto } from '../dtos/user.dto';
import { JwtService } from '@nestjs/jwt';
import {
  hashPassword,
  verifyPassword,
} from '../../commons/utils/password.util';
import { AuthServiceInterface } from './auth.service.interface';

@Injectable()
export class AuthService implements AuthServiceInterface {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser({
    email,
    password,
  }: UserDto): Promise<UserWithoutPassword | null> {
    this.logger.log(`Validating user with email: ${email}`);
    const user = await this.usersService.getUserByParams({ email });

    if (!user) {
      this.logger.warn(`User with email ${email} not found`);
      return null;
    }

    const passwordsMatch = await verifyPassword(user.password, password);

    if (!passwordsMatch) {
      this.logger.warn(`Invalid password for user: ${email}`);
      return null;
    }

    return {
      id: user.id,
      email: user.email,
    };
  }

  async signUp(user: UserDto): Promise<UserLoginResponse> {
    this.logger.log(`Signing up new user with email: ${user.email}`);
    const userExists = await this.usersService.getUserByParams({
      email: user.email,
    });

    if (userExists) {
      this.logger.warn(`User with email ${user.email} already exists`);
      throw new HttpException('User already exists!', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await hashPassword(user.password);
    const newUser = await this.usersService.addUser({
      email: user.email,
      password: hashedPassword,
    });

    return this.signIn(newUser.email, newUser.id);
  }

  async signIn(email: string, id: string): Promise<UserLoginResponse> {
    this.logger.log(`Signing in user: ${email}`);
    const payload = { email, id };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }
}
