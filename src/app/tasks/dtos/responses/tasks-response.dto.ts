import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../../../commons/enums/task-status.enum';

export class TaskResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ enum: TaskStatus })
  status: string;

  @ApiProperty()
  userId: string;
}
