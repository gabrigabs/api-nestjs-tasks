import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TaskStatus } from '../../commons/enums/task-status.enum';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(TaskStatus)
  status: string;
}
