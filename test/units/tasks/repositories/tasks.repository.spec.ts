import { Test, TestingModule } from '@nestjs/testing';
import { TasksRepository } from '../../../../src/app/tasks/repositories/tasks.repository';
import { PrismaService } from '../../../../src/app/prisma/services/prisma.service';
import { HttpException } from '@nestjs/common';
import {
  createTaskMock,
  taskListMock,
  taskMock,
  updateTaskMock,
} from '../../mocks/tasks.mock';
import { TaskStatus } from '../../../../src/app/commons/enums/task-status.enum';

describe('TasksRepository', () => {
  let repository: TasksRepository;

  const mockPrismaService = {
    task: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<TasksRepository>(TasksRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create task successfully', async () => {
      mockPrismaService.task.create.mockResolvedValue(taskMock);

      const result = await repository.createTask(
        createTaskMock,
        taskMock.userId,
      );

      expect(result).toEqual(taskMock);
      expect(mockPrismaService.task.create).toHaveBeenCalledWith({
        data: {
          ...createTaskMock,
          status: TaskStatus.PENDING,
          userId: taskMock.userId,
        },
      });
    });

    it('should throw HttpException when creation fails', async () => {
      mockPrismaService.task.create.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        repository.createTask(createTaskMock, taskMock.userId),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('findTaskById', () => {
    it('should find task by param successfully', async () => {
      mockPrismaService.task.findFirst.mockResolvedValue(taskMock);

      const result = await repository.findTaskByParams({
        id: taskMock.id,
        userId: taskMock.userId,
      });

      expect(result).toEqual(taskMock);
      expect(mockPrismaService.task.findFirst).toHaveBeenCalledWith({
        where: { id: taskMock.id, userId: taskMock.userId },
      });
    });

    it('should return null when task not found', async () => {
      mockPrismaService.task.findFirst.mockResolvedValue(null);

      const result = await repository.findTaskByParams({
        id: 'nonexistent',
        userId: taskMock.userId,
      });

      expect(result).toBeNull();
    });
  });

  describe('findAllTasks', () => {
    it('should return all tasks', async () => {
      mockPrismaService.task.findMany.mockResolvedValue(taskListMock);
      mockPrismaService.task.count.mockResolvedValue(1);

      const result = await repository.findTasks(1, 1, {});

      expect(result).toEqual({ tasks: taskListMock, total: 1 });
      expect(mockPrismaService.task.findMany).toHaveBeenCalledWith({
        take: 1,
        skip: 1,
        where: {},
      });
      expect(mockPrismaService.task.count).toHaveBeenCalledWith({ where: {} });
    });
  });

  describe('updateTask', () => {
    it('should update task successfully', async () => {
      const updatedTask = { ...taskMock, ...updateTaskMock };
      mockPrismaService.task.update.mockResolvedValue(updatedTask);

      const result = await repository.updateTask(updateTaskMock, taskMock.id);

      expect(result).toEqual(updatedTask);
      expect(mockPrismaService.task.update).toHaveBeenCalledWith({
        where: { id: taskMock.id },
        data: updateTaskMock,
      });
    });

    it('should throw HttpException when update fails', async () => {
      mockPrismaService.task.update.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        repository.updateTask(updateTaskMock, taskMock.id),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      mockPrismaService.task.delete.mockResolvedValue(taskMock);

      const result = await repository.deleteTask(taskMock.id);

      expect(result).toEqual(undefined);
      expect(mockPrismaService.task.delete).toHaveBeenCalledWith({
        where: { id: taskMock.id },
      });
    });

    it('should throw HttpException when deletion fails', async () => {
      mockPrismaService.task.delete.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(repository.deleteTask(taskMock.id)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
