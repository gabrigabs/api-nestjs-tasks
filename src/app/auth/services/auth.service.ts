import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { UserLoginResponse } from '../../commons/types/user-login-response.type';
import { UserDto } from '../dtos/user.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import {
  hashPassword,
  verifyPassword,
} from '../../commons/utils/password.util';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser({
    email,
    password,
  }: UserDto): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.getUserByParams({ email });

    if (!user) {
      return null;
    }

    const passwordsMatch = await verifyPassword(user.password, password);

    if (!passwordsMatch) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
    };
  }

  async signUp(user: UserDto): Promise<UserLoginResponse> {
    const userExists = await this.usersService.getUserByParams({
      email: user.email,
    });

    if (userExists) {
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
    const payload = { email, id };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
    };
  }
}
