import { Task } from '@prisma/client';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { UserWithoutPassword } from '../../commons/interfaces/user.interface';
import { PaginatedTasks } from '../../commons/interfaces/tasks.interface';
import { FindTasksQueryDto } from '../dtos/find-task-query.dto';

export interface TasksControllerInterface {
  addTask(body: CreateTaskDto, user: UserWithoutPassword): Promise<Task>;
  getTasks(query: FindTasksQueryDto): Promise<PaginatedTasks>;
  getTaskById(id: string): Promise<Task | null>;
  updateTask(
    id: string,
    body: UpdateTaskDto,
    user: UserWithoutPassword,
  ): Promise<Task>;
  deleteTask(id: string, user: UserWithoutPassword): Promise<void>;
}
