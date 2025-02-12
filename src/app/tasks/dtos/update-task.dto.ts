import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '../../commons/enums/task-status.enum';
import { Transform } from 'class-transformer';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @Transform((status: { value: string }) => status.value.toUpperCase())
  @IsString()
  @IsOptional()
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
