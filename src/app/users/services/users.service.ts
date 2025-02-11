import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { UsersServiceInterface } from './users.service.interface';
import { User } from '@prisma/client';

@Injectable()
export class UsersService implements UsersServiceInterface {
  constructor(private usersRepository: UsersRepository) {}

  async addUser(data: { email: string; password: string }) {
    return this.usersRepository.createUser(data);
  }

  async getUsers() {
    return this.usersRepository.findUsers();
  }

  async getUserByParams(params: Partial<User>) {
    return this.usersRepository.findUserByParams(params);
  }
}
