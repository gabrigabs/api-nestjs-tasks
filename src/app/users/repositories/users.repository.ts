import { User } from '@prisma/client';
import { UsersRepositoryInterface } from './users.repository.interface';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';

@Injectable()
export class UsersRepository implements UsersRepositoryInterface {
  private readonly logger = new Logger(UsersRepository.name);

  constructor(private prisma: PrismaService) {}

  async createUser(data: { email: string; password: string }): Promise<User> {
    this.logger.log(`Creating user with email: ${data.email}`);
    try {
      return await this.prisma.user.create({
        data: {
          email: data.email,
          password: data.password,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to create user`, error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findUserByParams(params: Partial<User>): Promise<User | null> {
    this.logger.log(`Finding user by params:  ${JSON.stringify(params)}`);
    try {
      return await this.prisma.user.findFirst({ where: params });
    } catch (error) {
      this.logger.error(
        `Failed to find user by params: ${JSON.stringify(params)}`,
        error,
      );
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
