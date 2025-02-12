import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  async findTaskById(id: string): Promise<Task> {
    const task = await this.tasksRepository.findTaskByParams({ id });

    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    return task;
  }

  async updateTask(
    data: UpdateTaskDto,
    id: string,
    userId: string,
  ): Promise<Task> {
    await this.verifyIfTaskBelongsToUser(id, userId);

    return this.tasksRepository.updateTask(data, id);
  }

  async deleteTask(id: string, userId: string): Promise<void> {
    await this.verifyIfTaskBelongsToUser(id, userId);

    await this.tasksRepository.deleteTask(id);
  }

  private async verifyIfTaskBelongsToUser(
    id: string,
    userId: string,
  ): Promise<void> {
    const task = await this.tasksRepository.findTaskByParams({ id, userId });

    if (!task) {
      throw new HttpException(
        'Provided task id does not belongs to user!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
