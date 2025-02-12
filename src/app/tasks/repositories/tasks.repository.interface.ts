import { Task } from '@prisma/client';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { TasksWithCount } from '../../commons/interfaces/tasks.interface';

export interface TasksRepositoryInterface {
  createTask(data: CreateTaskDto, userId: string): Promise<Task>;
  findTasks(
    skip: number,
    take: number,
    where?: Partial<Task>,
  ): Promise<TasksWithCount>;
  updateTask(data: UpdateTaskDto, id: string): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  findTaskByParams(params: Partial<Task>): Promise<Task | null>;
}
