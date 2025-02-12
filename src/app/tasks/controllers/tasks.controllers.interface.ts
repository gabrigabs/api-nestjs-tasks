import { Task } from '@prisma/client';
import { CreateTaskRequestDto } from '../dtos/requests/create-task-request.dto';
import { UpdateTaskRequestDto } from '../dtos/requests/update-task-request.dto';
import { UserWithoutPassword } from '../../commons/interfaces/user.interface';
import { FindTasksQueryRequestDto } from '../dtos/requests/find-task-query-request.dto';
import { PaginatedTasksResponseDto } from '../dtos/responses/paginated-tasks-response.dto';

export interface TasksControllerInterface {
  addTask(body: CreateTaskRequestDto, user: UserWithoutPassword): Promise<Task>;
  getTasks(query: FindTasksQueryRequestDto): Promise<PaginatedTasksResponseDto>;
  getTaskById(id: string): Promise<Task | null>;
  updateTask(
    id: string,
    body: UpdateTaskRequestDto,
    user: UserWithoutPassword,
  ): Promise<Task>;
  deleteTask(id: string, user: UserWithoutPassword): Promise<void>;
}
