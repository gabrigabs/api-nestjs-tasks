import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/app/prisma/services/prisma.service';
import { PrismaModule } from '../../../src/app/prisma/prisma.module';

describe('PrismaService', () => {
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [PrismaService],
    }).compile();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
  });

  it('should connect to PrismaClient successfully', async () => {
    const connectSpy = jest
      .spyOn(prismaService, '$connect')
      .mockResolvedValueOnce();
    await prismaService.onModuleInit();
    expect(connectSpy).toHaveBeenCalledTimes(1);
  });
});
