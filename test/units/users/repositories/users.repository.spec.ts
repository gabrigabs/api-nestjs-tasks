import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from '../../../../src/app/users/repositories/users.repository';
import { PrismaService } from '../../../../src/app/prisma/services/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { createUserMock, userMock } from '../../mocks/users.mock';

describe('UsersRepository', () => {
  let repository: UsersRepository;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should successfully create a user', async () => {
      mockPrismaService.user.create.mockResolvedValue(userMock);

      const result = await repository.createUser(createUserMock);

      expect(result).toEqual(userMock);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: createUserMock,
      });
    });

    it('should throw HttpException when creation fails', async () => {
      mockPrismaService.user.create.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(repository.createUser(createUserMock)).rejects.toThrow(
        new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('findUserByParams', () => {
    it('should successfully find a user by params', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(userMock);

      const result = await repository.findUserByParams({
        email: userMock.email,
      });

      expect(result).toEqual(userMock);
      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: { email: userMock.email },
      });
    });

    it('should return null when user is not found', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      const result = await repository.findUserByParams({
        email: 'nonexistent@example.com',
      });

      expect(result).toBeNull();
    });

    it('should throw HttpException when query fails', async () => {
      mockPrismaService.user.findFirst.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        repository.findUserByParams({ email: userMock.email }),
      ).rejects.toThrow(
        new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});
