import { Task, User } from '@prisma/client';
import { randomUUID } from 'crypto';
import { UserRequestDto } from '../../../src/app/auth/dtos/requests/user-request.dto';
import { CreateTaskRequestDto } from '../../../src/app/tasks/dtos/requests/create-task-request.dto';
import { TaskStatus } from '../../../src/app/commons/enums/task-status.enum';

export class PrismaMock {
  private users: User[] = [];
  private tasks: Task[] = [];

  user = {
    create: jest.fn().mockImplementation((data: { data: UserRequestDto }) => {
      const user: User = {
        id: randomUUID(),
        ...data.data,
      };
      this.users.push(user);
      return Promise.resolve(user);
    }),
    findFirst: jest.fn().mockImplementation((query: { where: User }) => {
      const user = this.users.find((u) => u.email === query.where.email);
      return Promise.resolve(user);
    }),
  };
  task = {
    create: jest
      .fn()
      .mockImplementation(
        (data: { data: CreateTaskRequestDto & { userId: string } }) => {
          const task: Task = {
            id: randomUUID(),
            ...data.data,
            status: TaskStatus.PENDING,
          };
          this.tasks.push(task);
          return Promise.resolve(task);
        },
      ),
    findMany: jest.fn().mockImplementation(() => {
      return Promise.resolve(this.tasks);
    }),
    count: jest.fn().mockImplementation(() => {
      return Promise.resolve(this.tasks.length);
    }),
    findFirst: jest.fn().mockImplementation((query: { where: Task }) => {
      const task = this.tasks.find((t) => t.id === query.where.id);
      return Promise.resolve(task);
    }),
    update: jest
      .fn()
      .mockImplementation(
        (data: { where: { id: string }; data: Partial<Task> }) => {
          const task = this.tasks.find((t) => t.id === data.where.id);
          if (!task) {
            return Promise.resolve(null);
          }
          const updatedTask = { ...task, ...data.data };
          this.tasks = this.tasks.map((t) =>
            t.id === data.where.id ? updatedTask : t,
          );
          return Promise.resolve(updatedTask);
        },
      ),
    delete: jest.fn().mockImplementation((query: { where: Task }) => {
      const task = this.tasks.find((t) => t.id === query.where.id);
      if (!task) {
        return Promise.resolve(null);
      }
      this.tasks = this.tasks.filter((t) => t.id !== query.where.id);
      return Promise.resolve(task);
    }),
  };
}
