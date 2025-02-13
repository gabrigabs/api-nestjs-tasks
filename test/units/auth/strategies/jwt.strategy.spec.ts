import { JwtStrategy } from '../../../../src/app/auth/strategies/jwt.strategy';
import { ConfigService } from '@nestjs/config';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: Partial<ConfigService>;

  beforeEach(() => {
    configService = {
      getOrThrow: jest.fn().mockReturnValue('test-secret'),
    };
    strategy = new JwtStrategy(configService as ConfigService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should validate and return user payload', () => {
    const payload = { id: '1', email: 'test@test.com' };

    const result = strategy.validate(payload);

    expect(result).toEqual(payload);
    expect(configService.getOrThrow).toHaveBeenCalledWith('JWT_SECRET');
  });
});
