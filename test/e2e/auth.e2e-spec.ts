import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app/app.module';
import { PrismaService } from '../../src/app/prisma/services/prisma.service';
import { PrismaMock } from './mocks/prisma.mock';
import { NestExpressApplication } from '@nestjs/platform-express';

describe('AuthController e2e', () => {
  let app: NestExpressApplication;
  let prismaMock: PrismaMock;

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
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  const testUser = {
    email: 'test@example.com',
    password: 'Password123!',
  };

  describe('POST /auth/sign-up', () => {
    it('should create a new user and return token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
      expect(prismaMock.user.create).toHaveBeenCalled();
    });

    it('should fail with invalid email', () => {
      return request(app.getHttpServer())
        .post('/auth/sign-up')
        .send({ ...testUser, email: 'invalid-email' })
        .expect(400);
    });
  });

  describe('POST /auth/sign-in', () => {
    it('should authenticate user and return token', async () => {
      await prismaMock.user.create({ data: testUser });

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
      expect(prismaMock.user.findFirst).toHaveBeenCalled();
    });

    it('should fail with wrong password', async () => {
      await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({ ...testUser, password: 'wrongpassword' })
        .expect(401);
    });
  });
});
