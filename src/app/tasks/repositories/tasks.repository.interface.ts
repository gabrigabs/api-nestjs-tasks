import { Task } from '@prisma/client';

export interface TasksRepositoryInterface {
  createTask(data: {
    title: string;
    description: string;
    userId: string;
  }): Promise<Task>;
  findTasks(): Promise<Task[]>;
  findTasksByUserId(userId: string): Promise<Task[]>;
  findTaskById(id: string): Promise<Task | null>;
  updateTask(
    id: string,
    data: {
      title?: string;
      description?: string;
      status?: string;
    },
  ): Promise<Task>;
  deleteTask(id: string): Promise<Task>;
  findTaskByParams(params: Partial<Task>): Promise<Task | null>;
}
