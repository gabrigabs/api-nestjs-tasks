import { Task } from '@prisma/client';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';

export interface TasksServiceInterface {
  createTask(data: CreateTaskDto, userId: string): Promise<Task>;
  findTasks(): Promise<Task[]>;
  findTaskById(id: string): Promise<Task>;
  updateTask(data: UpdateTaskDto, id: string, userId: string): Promise<Task>;
  deleteTask(id: string, userId: string): Promise<void>;
}
