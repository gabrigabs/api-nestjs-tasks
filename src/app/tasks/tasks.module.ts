import { Module } from '@nestjs/common';
import { TasksRepository } from './repositories/tasks.repository';
import { PrismaService } from '../prisma/services/prisma.service';
import { TasksService } from './services/tasks.service';
import { TasksController } from './controllers/tasks.controller';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Module({
  controllers: [TasksController],
  providers: [TasksRepository, TasksService, PrismaService, JwtAuthGuard],
})
export class TasksModule {}
