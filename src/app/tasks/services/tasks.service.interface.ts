import { Task } from '@prisma/client';
import { CreateTaskRequestDto } from '../dtos/requests/create-task-request.dto';
import { UpdateTaskRequestDto } from '../dtos/requests/update-task-request.dto';
import { FindTasksQueryRequestDto } from '../dtos/requests/find-task-query-request.dto';
import { PaginatedTasks } from '../../commons/interfaces/tasks.interface';

export interface TasksServiceInterface {
  createTask(data: CreateTaskRequestDto, userId: string): Promise<Task>;
  findTasks(query: FindTasksQueryRequestDto): Promise<PaginatedTasks>;
  findTaskById(id: string): Promise<Task>;
  updateTask(
    data: UpdateTaskRequestDto,
    id: string,
    userId: string,
  ): Promise<Task>;
  deleteTask(id: string, userId: string): Promise<void>;
}
