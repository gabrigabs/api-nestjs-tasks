import { Injectable, Logger } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { UsersServiceInterface } from './users.service.interface';
import { User } from '@prisma/client';

@Injectable()
export class UsersService implements UsersServiceInterface {
  private readonly logger = new Logger(UsersService.name);

  constructor(private usersRepository: UsersRepository) {}

  async addUser(data: { email: string; password: string }) {
    this.logger.log(`Adding new user with email: ${data.email}`);
    const user = await this.usersRepository.createUser(data);
    return user;
  }

  async getUserByParams(params: Partial<User>) {
    this.logger.log(`Getting user by params: ${JSON.stringify(params)}`);
    const user = await this.usersRepository.findUserByParams(params);
    return user;
  }
}
