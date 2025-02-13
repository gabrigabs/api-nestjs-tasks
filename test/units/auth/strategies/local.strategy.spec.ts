import { LocalStrategy } from '../../../../src/app/auth/strategies/local.strategy';
import { AuthService } from '../../../../src/app/auth/services/auth.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: Partial<AuthService>;

  beforeEach(() => {
    authService = {
      validateUser: jest.fn(),
    };
    strategy = new LocalStrategy(authService as AuthService);
  });

  it('should validate and return a user with valid credentials', async () => {
    const mockUser = { id: '1', email: 'test@test.com', name: 'Test User' };
    (authService.validateUser as jest.Mock).mockResolvedValue(mockUser);

    const result = await strategy.validate('test@test.com', 'password');

    expect(result).toEqual(mockUser);
    expect(authService.validateUser).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password',
    });
  });

  it('should throw unauthorized exception with invalid credentials', async () => {
    (authService.validateUser as jest.Mock).mockResolvedValue(null);

    await expect(strategy.validate('test@test.com', 'wrong')).rejects.toThrow(
      new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED),
    );
  });
});
