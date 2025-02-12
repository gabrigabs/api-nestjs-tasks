import { Injectable } from '@nestjs/common';
import { TasksServiceInterface } from './tasks.service.interface';
import { Task } from '@prisma/client';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { TasksRepository } from '../repositories/tasks.repository';

@Injectable()
export class TasksService implements TasksServiceInterface {
  constructor(private tasksRepository: TasksRepository) {}

  createTask(data: CreateTaskDto, userId: string): Promise<Task> {
    return this.tasksRepository.createTask(data, userId);
  }

  findTasks(): Promise<Task[]> {
    return this.tasksRepository.findTasks();
  }

  updateTask(data: UpdateTaskDto, id: string): Promise<Task> {
    return this.tasksRepository.updateTask(data, id);
  }

  deleteTask(id: string): Promise<Task> {
    return this.tasksRepository.deleteTask(id);
  }

  findTaskByParams(params: Partial<Task>): Promise<Task | null> {
    return this.tasksRepository.findTaskByParams(params);
  }
}
