import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersRepository } from './repositories/users.repository';

import { PrismaService } from '../prisma/services/prisma.service';

@Module({
  providers: [UsersRepository, UsersService, PrismaService],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
