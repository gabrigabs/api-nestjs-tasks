import { User } from '@prisma/client';
import { UsersRepositoryInterface } from './users.repository.interface';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';

@Injectable()
export class UsersRepository implements UsersRepositoryInterface {
  constructor(private prisma: PrismaService) {}

  async createUser(data: { email: string; password: string }): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
      },
    });
  }

  async findUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findUserByParams(params: Partial<User>): Promise<User | null> {
    return this.prisma.user.findFirst({ where: params });
  }
}
