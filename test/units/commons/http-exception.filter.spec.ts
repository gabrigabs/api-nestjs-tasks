import { HttpExceptionsFilter } from '../../../src/app/commons/filters/http-exception.filter';
import {
  HttpException,
  HttpStatus,
  ArgumentsHost,
  ContextType,
} from '@nestjs/common';
import { Response, Request } from 'express';

describe('HttpExceptionsFilter', () => {
  let filter: HttpExceptionsFilter;
  let mockResponse: Partial<Response>;
  let mockRequest: Partial<Request>;

  beforeEach(() => {
    filter = new HttpExceptionsFilter();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockRequest = {
      method: 'GET',
      url: '/test-url',
    };
  });

  const createArgumentsHost = (): ArgumentsHost => {
    return {
      switchToHttp: () => ({
        getResponse: <T = Response>(): T => mockResponse as T,
        getRequest: <T = Request>(): T => mockRequest as T,
        getNext: <T = any>(): T => undefined as T,
      }),
      switchToRpc: () => {
        throw new Error('Method not implemented.');
      },
      switchToWs: () => {
        throw new Error('Method not implemented.');
      },
      getArgByIndex: <T = any>(): T => undefined as T,
      getArgs: <T extends Array<any> = any[]>(): T => [] as unknown as T,
      getType: <TContext extends string = ContextType>(): TContext =>
        'http' as TContext,
    };
  };

  it('should handle HttpException correctly', () => {
    const errorMessage = 'Test error';
    const exception = new HttpException(
      { message: errorMessage },
      HttpStatus.BAD_REQUEST,
    );
    const host = createArgumentsHost();

    filter.catch(exception, host);

    expect(mockResponse.status as jest.Mock).toHaveBeenCalledWith(
      HttpStatus.BAD_REQUEST,
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const firstCall: unknown[] = (mockResponse.json as jest.Mock).mock.calls[0];
    const jsonArg = firstCall[0] as {
      statusCode: number;
      path: string;
      method: string;
      message: string;
      timestamp: string;
    };
    expect(jsonArg.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(jsonArg.path).toBe(mockRequest.url);
    expect(jsonArg.method).toBe(mockRequest.method);
    expect(jsonArg.message).toEqual(errorMessage);
    expect(jsonArg.timestamp).toBeDefined();
  });

  it('should handle non-HttpException correctly', () => {
    const exception = new Error('Unexpected error');
    const host = createArgumentsHost();

    filter.catch(exception, host);

    expect(mockResponse.status as jest.Mock).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const firstCall: unknown[] = (mockResponse.json as jest.Mock).mock.calls[0];
    const jsonArg = firstCall[0] as {
      statusCode: number;
      path: string;
      method: string;
      message: string;
      timestamp: string;
    };
    expect(jsonArg.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(jsonArg.path).toBe(mockRequest.url);
    expect(jsonArg.method).toBe(mockRequest.method);
    expect(jsonArg.message).toBe('Internal server error');
    expect(jsonArg.timestamp).toBeDefined();
  });
});
