import { Injectable } from '@nestjs/common';
import { TasksRepositoryInterface } from './tasks.repository.interface';
import { Task } from '@prisma/client';

@Injectable()
export class TasksService implements TasksRepositoryInterface {
  createTask(data: {
    title: string;
    description: string;
    userId: string;
  }): Promise<Task> {
    throw new Error('Method not implemented.');
  }
  findTasks(): Promise<Task[]> {
    throw new Error('Method not implemented.');
  }
  updateTask(
    id: string,
    data: { title?: string; description?: string; status?: string },
  ): Promise<Task> {
    throw new Error('Method not implemented.');
  }
  deleteTask(id: string): Promise<Task> {
    throw new Error('Method not implemented.');
  }
  findTaskByParams(params: Partial<Task>): Promise<Task | null> {
    throw new Error('Method not implemented.');
  }
}
