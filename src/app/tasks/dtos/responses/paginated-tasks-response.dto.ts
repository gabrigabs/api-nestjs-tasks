import { ApiProperty } from '@nestjs/swagger';
import { TaskResponseDto } from './tasks-response.dto';

export class PaginatedTasksResponseDto {
  @ApiProperty({ type: TaskResponseDto })
  data: TaskResponseDto[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  total: number;
}
