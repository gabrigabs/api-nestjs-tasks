import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../../../src/app/auth/controllers/auth.controller';
import { AuthService } from '../../../../src/app/auth/services/auth.service';
import { loginOrRegisterMock, signResponseMock } from '../../mocks/users.mock';

describe('AuthController', () => {
  let authController: AuthController;

  const mockAuthService = {
    signIn: jest.fn(),
    signUp: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = moduleFixture.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should return a valid UserLoginResponseDto when signIn is successful', async () => {
      mockAuthService.signIn.mockResolvedValue(signResponseMock);

      const result = await authController.signIn({
        ...loginOrRegisterMock,
        id: '1',
      });

      expect(result).toEqual(signResponseMock);
      expect(mockAuthService.signIn).toHaveBeenCalledWith(
        loginOrRegisterMock.email,
        '1',
      );
    });
  });

  describe('signUp', () => {
    it('should return a valid UserLoginResponseDto when signUp is successful', async () => {
      mockAuthService.signUp.mockResolvedValue(signResponseMock);

      const result = await authController.signUp(loginOrRegisterMock);

      expect(result).toEqual(signResponseMock);
      expect(mockAuthService.signUp).toHaveBeenCalledWith(loginOrRegisterMock);
    });
  });
});
