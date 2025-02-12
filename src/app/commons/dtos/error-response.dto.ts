import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  timestamp: string;
  @ApiProperty()
  path: string;
  @ApiProperty()
  method: string;
  @ApiProperty({ type: String, isArray: true })
  message: string | string[];
}
