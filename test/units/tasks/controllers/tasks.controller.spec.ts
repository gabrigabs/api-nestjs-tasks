import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from '../../../../src/app/tasks/controllers/tasks.controller';
import { TasksService } from '../../../../src/app/tasks/services/tasks.service';
import {
  createTaskMock,
  taskListMock,
  taskMock,
  updateTaskMock,
} from '../../mocks/tasks.mock';
import { TaskStatus } from '../../../../src/app/commons/enums/task-status.enum';

describe('TasksController', () => {
  let controller: TasksController;
  const mockUser = { id: '1', email: 'test@example.com' };

  const mockTasksService = {
    createTask: jest.fn(),
    findTaskById: jest.fn(),
    findTasks: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addTask', () => {
    it('should create a task successfully', async () => {
      mockTasksService.createTask.mockResolvedValue(taskMock);

      const result = await controller.addTask(createTaskMock, mockUser);

      expect(result).toEqual(taskMock);
      expect(mockTasksService.createTask).toHaveBeenCalledWith(
        createTaskMock,
        mockUser.id,
      );
    });
  });

  describe('getTasks', () => {
    it('should return paginated tasks', async () => {
      const paginatedResponse = {
        data: taskListMock,
        page: 1,
        totalPages: 1,
        total: taskListMock.length,
      };
      mockTasksService.findTasks.mockResolvedValue(paginatedResponse);

      const result = await controller.getTasks({});

      expect(result).toEqual(paginatedResponse);
      expect(mockTasksService.findTasks).toHaveBeenCalledWith({});
    });

    it('should return filtered and paginated tasks', async () => {
      const query = { page: 2, limit: 5, status: TaskStatus.DONE };
      const paginatedResponse = {
        data: taskListMock,
        page: 2,
        totalPages: 1,
        total: taskListMock.length,
      };
      mockTasksService.findTasks.mockResolvedValue(paginatedResponse);

      const result = await controller.getTasks(query);

      expect(result).toEqual(paginatedResponse);
      expect(mockTasksService.findTasks).toHaveBeenCalledWith(query);
    });
  });

  describe('getTaskById', () => {
    it('should return a task when found', async () => {
      mockTasksService.findTaskById.mockResolvedValue(taskMock);

      const result = await controller.getTaskById(taskMock.id);

      expect(result).toEqual(taskMock);
      expect(mockTasksService.findTaskById).toHaveBeenCalledWith(taskMock.id);
    });

    it('should return null when task is not found', async () => {
      mockTasksService.findTaskById.mockResolvedValue(null);

      const result = await controller.getTaskById(taskMock.id);

      expect(result).toEqual(null);
    });
  });

  describe('updateTask', () => {
    it('should update task successfully', async () => {
      const updatedTask = { ...taskMock, ...updateTaskMock };
      mockTasksService.updateTask.mockResolvedValue(updatedTask);

      const result = await controller.updateTask(
        taskMock.id,
        updateTaskMock,
        mockUser,
      );

      expect(result).toEqual(updatedTask);
      expect(mockTasksService.updateTask).toHaveBeenCalledWith(
        updateTaskMock,
        taskMock.id,
        mockUser.id,
      );
    });
  });

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      mockTasksService.deleteTask.mockResolvedValue(undefined);

      const result = await controller.deleteTask(taskMock.id, mockUser);

      expect(result).toBeUndefined();
      expect(mockTasksService.deleteTask).toHaveBeenCalledWith(
        taskMock.id,
        mockUser.id,
      );
    });
  });
});
