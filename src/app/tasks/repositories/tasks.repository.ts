import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { TasksRepositoryInterface } from './tasks.repository.interface';
import { Task } from '@prisma/client';
import { CreateTaskRequestDto } from '../dtos/requests/create-task-request.dto';
import { UpdateTaskRequestDto } from '../dtos/requests/update-task-request.dto';
import { PrismaService } from '../../prisma/services/prisma.service';
import { TaskStatus } from '../../commons/enums/task-status.enum';
import { TasksWithCount } from '../../commons/interfaces/tasks.interface';

@Injectable()
export class TasksRepository implements TasksRepositoryInterface {
  private readonly logger = new Logger(TasksRepository.name);

  constructor(private prismaService: PrismaService) {}

  async createTask(data: CreateTaskRequestDto, userId: string): Promise<Task> {
    this.logger.log(`Creating task for userId: ${userId}`);
    try {
      return await this.prismaService.task.create({
        data: { ...data, status: TaskStatus.PENDING, userId },
      });
    } catch (error) {
      this.logger.error(`Failed to create task for userId: ${userId}`, error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findTasks(
    skip: number,
    take: number,
    where?: Partial<Task>,
  ): Promise<TasksWithCount> {
    this.logger.log(
      `Finding all tasks skipping: ${skip}, taking: ${take} with params: ${JSON.stringify(where)}`,
    );
    try {
      const [tasks, total] = await Promise.all([
        this.prismaService.task.findMany({
          skip,
          take,
          where,
        }),
        this.prismaService.task.count({ where }),
      ]);
      return { tasks, total };
    } catch (error) {
      this.logger.error('Failed to find tasks', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateTask(data: UpdateTaskRequestDto, id: string): Promise<Task> {
    this.logger.log(`Updating task with id: ${id}`);
    try {
      return await this.prismaService.task.update({ data, where: { id } });
    } catch (error) {
      this.logger.error(`Failed to update task with id: ${id}`, error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteTask(id: string): Promise<void> {
    this.logger.log(`Deleting task with id: ${id}`);
    try {
      await this.prismaService.task.delete({ where: { id } });
    } catch (error) {
      this.logger.error(`Failed to delete task with id: ${id}`, error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findTaskByParams(params: Partial<Task>): Promise<Task | null> {
    this.logger.log(`Finding task by params: ${JSON.stringify(params)}`);
    try {
      return await this.prismaService.task.findFirst({ where: params });
    } catch (error) {
      this.logger.error(
        `Failed to find task params: ${JSON.stringify(params)}`,
        error,
      );
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
