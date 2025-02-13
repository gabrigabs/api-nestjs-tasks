import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../../../../src/app/tasks/services/tasks.service';
import { TasksRepository } from '../../../../src/app/tasks/repositories/tasks.repository';
import {
  createTaskMock,
  taskListMock,
  taskMock,
  updateTaskMock,
} from '../../mocks/tasks.mock';
import { HttpException } from '@nestjs/common';
import { TaskStatus } from '../../../../src/app/commons/enums/task-status.enum';

describe('TasksService', () => {
  let service: TasksService;

  const mockTasksRepository = {
    createTask: jest.fn(),
    findTaskByParams: jest.fn(),
    findTasks: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TasksRepository,
          useValue: mockTasksRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      mockTasksRepository.createTask.mockResolvedValue(taskMock);

      const result = await service.createTask(createTaskMock, taskMock.userId);

      expect(result).toEqual(taskMock);
      expect(mockTasksRepository.createTask).toHaveBeenCalledWith(
        {
          ...createTaskMock,
        },
        taskMock.userId,
      );
    });
  });

  describe('findTaskById', () => {
    it('should return a task when found', async () => {
      mockTasksRepository.findTaskByParams.mockResolvedValue(taskMock);

      const result = await service.findTaskById(taskMock.id);

      expect(result).toEqual(taskMock);
      expect(mockTasksRepository.findTaskByParams).toHaveBeenCalledWith({
        id: taskMock.id,
      });
    });

    it('should throw exception when task not found', async () => {
      mockTasksRepository.findTaskByParams.mockResolvedValue(null);

      await expect(service.findTaskById('nonexistent')).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('findTasks', () => {
    it('should return all tasks for user', async () => {
      mockTasksRepository.findTasks.mockResolvedValue({
        tasks: taskListMock,
        total: taskListMock.length,
      });

      const result = await service.findTasks({});

      expect(result).toEqual({
        data: taskListMock,
        page: 1,
        totalPages: 1,
        total: taskListMock.length,
      });
      expect(mockTasksRepository.findTasks).toHaveBeenCalledWith(0, 10, {});
    });

    it('should return all tasks for user with pagination', async () => {
      mockTasksRepository.findTasks.mockResolvedValue({
        tasks: taskListMock,
        total: taskListMock.length,
      });

      const result = await service.findTasks({
        page: 2,
        limit: 5,
        status: TaskStatus.DONE,
      });

      expect(result).toEqual({
        data: taskListMock,
        page: 2,
        totalPages: 1,
        total: taskListMock.length,
      });
      expect(mockTasksRepository.findTasks).toHaveBeenCalledWith(5, 5, {
        status: TaskStatus.DONE,
      });
    });
  });

  describe('updateTask', () => {
    it('should update task successfully', async () => {
      mockTasksRepository.findTaskByParams.mockResolvedValue(taskMock);
      mockTasksRepository.updateTask.mockResolvedValue({
        ...taskMock,
        ...updateTaskMock,
      });

      const result = await service.updateTask(
        updateTaskMock,
        taskMock.id,
        taskMock.userId,
      );

      expect(result).toEqual({ ...taskMock, ...updateTaskMock });
      expect(mockTasksRepository.updateTask).toHaveBeenCalledWith(
        updateTaskMock,
        taskMock.id,
      );
    });

    it('should throw exception when task not found', async () => {
      mockTasksRepository.findTaskByParams.mockResolvedValue(null);

      await expect(
        service.updateTask(updateTaskMock, 'nonexistent', taskMock.userId),
      ).rejects.toThrow(HttpException);
    });

    it('should throw exception when task does not belong to user', async () => {
      mockTasksRepository.findTaskByParams.mockResolvedValue({
        ...taskMock,
        userId: 'another_user',
      });

      await expect(
        service.updateTask(updateTaskMock, taskMock.id, taskMock.userId),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      mockTasksRepository.findTaskByParams.mockResolvedValue(taskMock);
      mockTasksRepository.deleteTask.mockResolvedValue(taskMock);

      const result = await service.deleteTask(taskMock.id, taskMock.userId);

      expect(result).toEqual(undefined);
      expect(mockTasksRepository.deleteTask).toHaveBeenCalledWith(taskMock.id);
    });

    it('should throw exception when task not found', async () => {
      mockTasksRepository.findTaskByParams.mockResolvedValue(null);

      await expect(
        service.deleteTask('nonexistent', taskMock.userId),
      ).rejects.toThrow(HttpException);
    });

    it('should throw exception when task does not belong to user', async () => {
      mockTasksRepository.findTaskByParams.mockResolvedValue({
        ...taskMock,
        userId: 'another_user',
      });

      await expect(
        service.deleteTask(taskMock.id, taskMock.userId),
      ).rejects.toThrow(HttpException);
    });
  });
});
