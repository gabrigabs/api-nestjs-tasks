import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../../../src/app/users/services/users.service';
import { UsersRepository } from '../../../../src/app/users/repositories/users.repository';
import { createUserMock, userMock } from '../../mocks/users.mock';

describe('UsersService', () => {
  let service: UsersService;

  const mockUsersRepository = {
    createUser: jest.fn(),
    findUserByParams: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = moduleFixture.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addUser', () => {
    it('should successfully create a user', async () => {
      mockUsersRepository.createUser.mockResolvedValue(userMock);

      const result = await service.addUser(createUserMock);

      expect(result).toEqual(userMock);
      expect(mockUsersRepository.createUser).toHaveBeenCalledWith(
        createUserMock,
      );
      expect(mockUsersRepository.createUser).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUserByParams', () => {
    it('should successfully find a user by params', async () => {
      mockUsersRepository.findUserByParams.mockResolvedValue(userMock);

      const result = await service.getUserByParams({ email: userMock.email });

      expect(result).toEqual(userMock);
      expect(mockUsersRepository.findUserByParams).toHaveBeenCalledWith({
        email: userMock.email,
      });
      expect(mockUsersRepository.findUserByParams).toHaveBeenCalledTimes(1);
    });

    it('should return null when user is not found', async () => {
      mockUsersRepository.findUserByParams.mockResolvedValue(null);

      const result = await service.getUserByParams({
        email: 'nonexistent@example.com',
      });

      expect(result).toBeNull();
      expect(mockUsersRepository.findUserByParams).toHaveBeenCalledWith({
        email: 'nonexistent@example.com',
      });
      expect(mockUsersRepository.findUserByParams).toHaveBeenCalledTimes(1);
    });
  });
});
