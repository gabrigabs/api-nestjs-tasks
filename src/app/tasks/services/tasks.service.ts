import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TasksServiceInterface } from './tasks.service.interface';
import { Task } from '@prisma/client';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { TasksRepository } from '../repositories/tasks.repository';
import { FindTasksQueryDto } from '../dtos/find-task-query.dto';
import { PaginatedTasks } from '../../commons/interfaces/tasks.interface';

@Injectable()
export class TasksService implements TasksServiceInterface {
  constructor(private tasksRepository: TasksRepository) {}

  createTask(data: CreateTaskDto, userId: string): Promise<Task> {
    return this.tasksRepository.createTask(data, userId);
  }

  async findTasks(query: FindTasksQueryDto): Promise<PaginatedTasks> {
    const { skip, take, where } = this.mountPaginateAndSearchParams(query);

    const { tasks, total } = await this.tasksRepository.findTasks(
      skip,
      take,
      where,
    );

    return this.mountPaginatedTasksResponse(query, tasks, total);
  }

  async findTaskById(id: string): Promise<Task> {
    const task = await this.tasksRepository.findTaskByParams({ id });

    if (!task) {
      throw new HttpException(
        'Provided task id does not exists!',
        HttpStatus.NOT_FOUND,
      );
    }

    return task;
  }

  async updateTask(
    data: UpdateTaskDto,
    id: string,
    userId: string,
  ): Promise<Task> {
    const task = await this.findTaskById(id);

    this.verifyIfTaskBelongsToUser(task, userId);

    return this.tasksRepository.updateTask(data, id);
  }

  async deleteTask(id: string, userId: string): Promise<void> {
    const task = await this.findTaskById(id);

    this.verifyIfTaskBelongsToUser(task, userId);

    await this.tasksRepository.deleteTask(id);
  }

  private verifyIfTaskBelongsToUser(task: Task, userId: string): void {
    if (task.userId !== userId) {
      throw new HttpException(
        'Provided task id does not belongs to user!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private mountPaginateAndSearchParams(params: FindTasksQueryDto) {
    const { page = 1, limit = 10, status } = params;

    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

    return {
      skip,
      take: limit,
      where,
    };
  }

  private mountPaginatedTasksResponse(
    query: FindTasksQueryDto,
    tasks: Task[],
    total: number,
  ) {
    const { page = 1, limit = 10 } = query;
    return {
      data: tasks,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    };
  }
}
