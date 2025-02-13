import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateTaskRequestDto } from './create-task-request.dto';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '../../../commons/enums/task-status.enum';
import { Transform } from 'class-transformer';

export class UpdateTaskRequestDto extends PartialType(CreateTaskRequestDto) {
  @ApiPropertyOptional({ enum: TaskStatus })
  @Transform((status: { value: string }) => status.value.toUpperCase())
  @IsString()
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
