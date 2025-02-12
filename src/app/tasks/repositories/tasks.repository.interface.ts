import { Task } from '@prisma/client';
import { CreateTaskRequestDto } from '../dtos/requests/create-task-request.dto';
import { UpdateTaskRequestDto } from '../dtos/requests/update-task-request.dto';
import { TasksWithCount } from '../../commons/interfaces/tasks.interface';

export interface TasksRepositoryInterface {
  createTask(data: CreateTaskRequestDto, userId: string): Promise<Task>;
  findTasks(
    skip: number,
    take: number,
    where?: Partial<Task>,
  ): Promise<TasksWithCount>;
  updateTask(data: UpdateTaskRequestDto, id: string): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  findTaskByParams(params: Partial<Task>): Promise<Task | null>;
}
