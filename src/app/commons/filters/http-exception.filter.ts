import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponseDto } from '../dtos/error-response.dto';

@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorMessage = this.getErrorMessage(exception);

    const errorStack =
      exception instanceof Error ? exception.stack : 'Unknown error';

    this.logger.error(`${request.method} ${request.url}`, errorStack);

    const errorResponse = this.mountErrorResponse(
      status,
      request,
      errorMessage,
    );

    response.status(status).json(errorResponse);
  }

  private getErrorMessage(exception: unknown): string | string[] {
    if (!(exception instanceof HttpException)) {
      return 'Internal server error';
    }

    const response = exception.getResponse();

    if (typeof response === 'string') {
      return response;
    }

    if (this.isErrorWithMessage(response)) {
      return response.message;
    }

    return JSON.stringify(response);
  }

  private isErrorWithMessage(
    error: unknown,
  ): error is { message: string | string[] } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      (typeof error.message === 'string' || Array.isArray(error.message))
    );
  }

  private mountErrorResponse(
    status: number,
    request: Request,
    message: string | string[],
  ): ErrorResponseDto {
    return {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
    };
  }
}
