import { Task } from '@prisma/client';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';

export interface TasksRepositoryInterface {
  createTask(data: CreateTaskDto, userId: string): Promise<Task>;
  findTasks(): Promise<Task[]>;
  updateTask(data: UpdateTaskDto, id: string): Promise<Task>;
  deleteTask(id: string): Promise<Task>;
  findTaskByParams(params: Partial<Task>): Promise<Task | null>;
}
