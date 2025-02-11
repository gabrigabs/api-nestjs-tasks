import { User } from '@prisma/client';
import { UsersRepositoryInterface } from './users.repository.interface';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';

@Injectable()
export class UsersRepository implements UsersRepositoryInterface {
  constructor(private prisma: PrismaService) {}

  async addUser(data: { email: string; password: string }): Promise<User> {
    return await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
      },
    });
  }

  async getUsers(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }
}
