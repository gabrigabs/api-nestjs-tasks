import { Injectable } from '@nestjs/common';
import { TasksRepositoryInterface } from './tasks.repository.interface';
import { Task } from '@prisma/client';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { PrismaService } from '../../prisma/services/prisma.service';

@Injectable()
export class TasksRepository implements TasksRepositoryInterface {
  constructor(private prismaService: PrismaService) {}

  createTask(data: CreateTaskDto, userId: string): Promise<Task> {
    return this.prismaService.task.create({ data: { ...data, userId } });
  }

  findTasks(): Promise<Task[]> {
    return this.prismaService.task.findMany();
  }

  updateTask(data: UpdateTaskDto, id: string): Promise<Task> {
    return this.prismaService.task.update({ data, where: { id } });
  }

  deleteTask(id: string): Promise<Task> {
    return this.prismaService.task.delete({ where: { id } });
  }

  findTaskByParams(params: Partial<Task>): Promise<Task | null> {
    return this.prismaService.task.findFirst({ where: params });
  }
}
