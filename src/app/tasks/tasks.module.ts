import { Module } from '@nestjs/common';
import { TasksRepository } from './repositories/tasks.repository';
import { PrismaService } from '../prisma/services/prisma.service';
import { TasksService } from './services/tasks.service';

@Module({
  providers: [TasksRepository, TasksService, PrismaService],
})
export class TasksModule {}
