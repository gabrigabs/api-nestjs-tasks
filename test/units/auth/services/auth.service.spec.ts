import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../../src/app/auth/services/auth.service';
import { UsersService } from '../../../../src/app/users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { hashPassword } from '../../../../src/app/commons/utils/password.util';
import { signResponseMock, userMock } from '../../../units/mocks/users.mock';

describe('AuthService', () => {
  let authService: AuthService;

  const mockUsersService = {
    getUserByParams: jest.fn(),
    addUser: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue(signResponseMock.accessToken),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      const hashedPassword = await hashPassword(userMock.password);
      const userMockWithHashedPassword = {
        ...userMock,
        password: hashedPassword,
      };

      mockUsersService.getUserByParams.mockResolvedValue(
        userMockWithHashedPassword,
      );

      const result = await authService.validateUser({
        email: userMock.email,
        password: userMock.password,
      });
      expect(result).toEqual({ id: userMock.id, email: userMock.email });
    });

    it('should return null when user is not found', async () => {
      mockUsersService.getUserByParams.mockResolvedValue(null);

      const result = await authService.validateUser({
        email: 'nonexistent@example.com',
        password: 'plain_password',
      });
      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      const hashedPassword = await hashPassword(userMock.password);
      const userMockWithHashedPassword = {
        ...userMock,
        password: hashedPassword,
      };

      mockUsersService.getUserByParams.mockResolvedValue(
        userMockWithHashedPassword,
      );

      const result = await authService.validateUser({
        email: userMock.email,
        password: 'wrong_password',
      });
      expect(result).toBeNull();
    });
  });

  describe('signUp', () => {
    it('should throw an error if user already exists', async () => {
      mockUsersService.getUserByParams.mockResolvedValue(userMock);

      await expect(
        authService.signUp({
          email: userMock.email,
          password: userMock.password,
        }),
      ).rejects.toThrow(
        new HttpException('User already exists!', HttpStatus.BAD_REQUEST),
      );
    });

    it('should create a new user and return a token', async () => {
      mockUsersService.getUserByParams.mockResolvedValue(null);
      mockUsersService.addUser.mockResolvedValue(userMock);

      const result = await authService.signUp({
        email: userMock.email,
        password: userMock.password,
      });
      expect(result).toEqual(signResponseMock);
    });
  });

  describe('signIn', () => {
    it('should return an access token', async () => {
      const result = await authService.signIn(userMock.email, userMock.id);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        email: userMock.email,
        id: userMock.id,
      });
      expect(result).toEqual(signResponseMock);
    });
  });
});
