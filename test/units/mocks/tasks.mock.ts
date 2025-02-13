import { Task } from '@prisma/client';
import { CreateTaskRequestDto } from '../../../src/app/tasks/dtos/requests/create-task-request.dto';
import { UpdateTaskRequestDto } from '../../../src/app/tasks/dtos/requests/update-task-request.dto';
import { TaskStatus } from '../../../src/app/commons/enums/task-status.enum';

export const taskBodyMock = {
  title: 'Teste',
  description: 'Descrição',
};

export const taskMock: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: TaskStatus.IN_PROGRESS,
  userId: '1',
};

export const createTaskMock: CreateTaskRequestDto = {
  title: 'Test Task',
  description: 'Test Description',
};

export const updateTaskMock: UpdateTaskRequestDto = {
  title: 'Updated Task',
  description: 'Updated Description',
  status: TaskStatus.DONE,
};

export const taskListMock: Task[] = [
  taskMock,
  {
    ...taskMock,
    id: '2',
    title: 'Second Task',
  },
];

export const paginatedTasksMock = {
  data: [taskMock],
  page: 1,
  totalPages: 1,
  total: 1,
};
