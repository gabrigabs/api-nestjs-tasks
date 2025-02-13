import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app/app.module';
import { PrismaService } from '../../src/app/prisma/services/prisma.service';
import { PrismaMock } from './mocks/prisma.mock';
import { AuthService } from '../../src/app/auth/services/auth.service';
import { TaskStatus } from '../../src/app/commons/enums/task-status.enum';
import { User, Task } from '@prisma/client';
import { PaginatedTasksResponseDto } from '../../src/app/tasks/dtos/responses/paginated-tasks-response.dto';
import { randomUUID } from 'crypto';
import { NestExpressApplication } from '@nestjs/platform-express';

describe('TasksController e2e', () => {
  let app: NestExpressApplication;
  let prismaMock: PrismaMock;
  let accessToken: string;
  let userId: string;

  beforeAll(async () => {
    prismaMock = new PrismaMock();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    const testUser = {
      email: 'test@example.com',
      password: 'Password123!',
    };

    const user = (await prismaMock.user.create({
      data: testUser,
    })) as User;

    userId = user.id;

    const authService = moduleFixture.get<AuthService>(AuthService);
    const { accessToken: token } = await authService.signIn(
      user.email,
      user.id,
    );
    accessToken = token;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /tasks', () => {
    it('should create a new task', async () => {
      const newTask = {
        title: 'Test Task',
        description: 'Test Description',
      };

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newTask)
        .expect(201);

      const responseBody = response.body as Task;

      expect(responseBody).toHaveProperty('id');
      expect(responseBody.title).toBe(newTask.title);
      expect(responseBody.description).toBe(newTask.description);
      expect(responseBody.status).toBe(TaskStatus.PENDING);
      expect(responseBody.userId).toBe(userId);
    });

    it('should fail with invalid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});

      expect(response.status).toBe(400);
    });

    it('should fail without authorization', async () => {
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send({})
        .expect(401);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /tasks', () => {
    it('should get all tasks', async () => {
      const response = await request(app.getHttpServer())
        .get('/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const responseBody = response.body as PaginatedTasksResponseDto;

      expect(Array.isArray(responseBody.data)).toBe(true);
      expect(responseBody).toHaveProperty('page');
      expect(responseBody).toHaveProperty('total');
      expect(responseBody).toHaveProperty('totalPages');
    });

    it('should fail without authorization', async () => {
      const response = await request(app.getHttpServer())
        .get('/tasks')
        .send({})
        .expect(401);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /tasks/:id', () => {
    it('should get task by id', async () => {
      const task = (await prismaMock.task.create({
        data: {
          title: 'Test Task',
          description: 'Test Description',
          userId,
        },
      })) as Task;

      const response = await request(app.getHttpServer())
        .get(`/tasks/${task.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const responseBody = response.body as Task;

      expect(responseBody.id).toBe(task.id);
      expect(responseBody.title).toBe(task.title);
      expect(responseBody.description).toBe(task.description);
      expect(responseBody.status).toBe(task.status);
      expect(responseBody.userId).toBe(task.userId);
    });

    it('should return 404 for non-existing task', async () => {
      const uuid = randomUUID();

      const response = await request(app.getHttpServer())
        .get(`/tasks/${uuid}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
    });

    it('should fail without authorization', async () => {
      const uuid = randomUUID();

      const response = await request(app.getHttpServer())
        .get(`/tasks/${uuid}`)
        .send({})
        .expect(401);

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update task', async () => {
      const task = (await prismaMock.task.create({
        data: {
          title: 'Test Task',
          description: 'Test Description',
          userId,
        },
      })) as Task;

      const updateData = {
        title: 'Updated Title',
        status: TaskStatus.DONE,
      };

      const response = await request(app.getHttpServer())
        .put(`/tasks/${task.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200);

      const responseBody = response.body as Task;

      expect(responseBody.title).toBe(updateData.title);
      expect(responseBody.status).toBe(updateData.status);
    });

    it('should fail without authorization', async () => {
      const uuid = randomUUID();

      const response = await request(app.getHttpServer())
        .put(`/tasks/${uuid}`)
        .send({})
        .expect(401);

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete task', async () => {
      const task = (await prismaMock.task.create({
        data: {
          title: 'Test Task',
          description: 'Test Description',
          userId,
        },
      })) as Task;

      await request(app.getHttpServer())
        .delete(`/tasks/${task.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);

      await request(app.getHttpServer())
        .get(`/tasks/${task.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should fail without authorization', async () => {
      const uuid = randomUUID();

      const response = await request(app.getHttpServer())
        .delete(`/tasks/${uuid}`)
        .send({})
        .expect(401);

      expect(response.status).toBe(401);
    });
  });
});
