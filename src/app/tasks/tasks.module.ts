import { Module } from '@nestjs/common';
import { TasksRepository } from './repositories/tasks.repository';

@Module({
  providers: [TasksRepository],
})
export class TasksModule {}
