import { Task } from '@prisma/client';

export interface TasksWithCount {
  tasks: Task[];
  total: number;
}

export interface PaginatedTasks {
  data: Task[];
  page: number;
  totalPages: number;
  total: number;
}
