import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async addUser(data: { email: string; password: string }) {
    return this.usersRepository.addUser(data);
  }

  async getUsers() {
    return this.usersRepository.getUsers();
  }
}
