import { Module } from '@nestjs/common';
import { TasksRepository } from './repositories/tasks.repository';
import { PrismaService } from '../prisma/services/prisma.service';

@Module({
  providers: [TasksRepository, PrismaService],
})
export class TasksModule {}
