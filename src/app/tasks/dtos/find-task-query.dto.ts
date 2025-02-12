import { Transform, Type } from 'class-transformer';
import { IsOptional, IsInt, Min, IsEnum } from 'class-validator';
import { TaskStatus } from '../../commons/enums/task-status.enum';

export class FindTasksQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @Transform((status: { value: string }) => status.value.toUpperCase())
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
