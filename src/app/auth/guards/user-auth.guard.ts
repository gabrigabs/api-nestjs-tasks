import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { UserDto } from '../dtos/user.dto';
import { validate } from 'class-validator';
import { Response } from 'express';

@Injectable()
export class UserAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const body = plainToClass(UserDto, request.body);

    const errors = await validate(body);

    const errorMessages = errors.flatMap(({ constraints }) =>
      constraints ? Object.values(constraints) : [],
    );

    if (errorMessages.length > 0) {
      response.status(HttpStatus.BAD_REQUEST).json({
        message: errorMessages,
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
      });
    }

    return super.canActivate(context) as boolean | Promise<boolean>;
  }
}
