import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { TasksServiceInterface } from './tasks.service.interface';
import { Task } from '@prisma/client';
import { CreateTaskRequestDto } from '../dtos/requests/create-task-request.dto';
import { UpdateTaskRequestDto } from '../dtos/requests/update-task-request.dto';
import { TasksRepository } from '../repositories/tasks.repository';
import { FindTasksQueryRequestDto } from '../dtos/requests/find-task-query-request.dto';
import { PaginatedTasks } from '../../commons/interfaces/tasks.interface';

@Injectable()
export class TasksService implements TasksServiceInterface {
  private readonly logger = new Logger(TasksService.name);

  constructor(private tasksRepository: TasksRepository) {}

  async createTask(data: CreateTaskRequestDto, userId: string): Promise<Task> {
    this.logger.log(`Creating task for user ${userId}`);
    const task = await this.tasksRepository.createTask(data, userId);
    return task;
  }

  async findTasks(query: FindTasksQueryRequestDto): Promise<PaginatedTasks> {
    this.logger.log(`Finding tasks with query params ${JSON.stringify(query)}`);
    const { skip, take, where } = this.mountPaginateAndSearchParams(query);

    const { tasks, total } = await this.tasksRepository.findTasks(
      skip,
      take,
      where,
    );

    const response = this.mountPaginatedTasksResponse(query, tasks, total);
    return response;
  }

  async findTaskById(id: string): Promise<Task> {
    this.logger.log(`Finding task by id: ${id}`);
    const task = await this.tasksRepository.findTaskByParams({ id });

    if (!task) {
      this.logger.warn(`Task with id: ${id} not found`);
      throw new HttpException(
        'Provided task id does not exists!',
        HttpStatus.NOT_FOUND,
      );
    }
    return task;
  }

  async updateTask(
    data: UpdateTaskRequestDto,
    id: string,
    userId: string,
  ): Promise<Task> {
    this.logger.log(`Updating task id: ${id} for userId: ${userId}`);
    const task = await this.findTaskById(id);

    this.verifyIfTaskBelongsToUser(task, userId);

    const updatedTask = await this.tasksRepository.updateTask(data, id);
    return updatedTask;
  }

  async deleteTask(id: string, userId: string): Promise<void> {
    this.logger.log(`Deleting task id: ${id} for userId: ${userId}`);
    const task = await this.findTaskById(id);

    this.verifyIfTaskBelongsToUser(task, userId);

    await this.tasksRepository.deleteTask(id);
  }

  private verifyIfTaskBelongsToUser(task: Task, userId: string): void {
    if (task.userId !== userId) {
      this.logger.warn(
        `Task id: ${task.id} does not belong to userId: ${userId}`,
      );
      throw new HttpException(
        'Provided task id does not belongs to user!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private mountPaginateAndSearchParams(params: FindTasksQueryRequestDto) {
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
    query: FindTasksQueryRequestDto,
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
