import { Task } from '@prisma/client';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { FindTasksQueryDto } from '../dtos/find-task-query.dto';
import { PaginatedTasks } from '../../commons/interfaces/tasks.interface';

export interface TasksServiceInterface {
  createTask(data: CreateTaskDto, userId: string): Promise<Task>;
  findTasks(query: FindTasksQueryDto): Promise<PaginatedTasks>;
  findTaskById(id: string): Promise<Task>;
  updateTask(data: UpdateTaskDto, id: string, userId: string): Promise<Task>;
  deleteTask(id: string, userId: string): Promise<void>;
}
