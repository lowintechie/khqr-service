import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let validationErrors = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const errorResponse = exceptionResponse as any;
        message = errorResponse.message || exception.message;

        if (Array.isArray(errorResponse.message)) {
          validationErrors = errorResponse.message;
        }
      } else {
        message = exception.message;
      }
    }

    const errorResponse = {
      success: false,
      message,
      ...(validationErrors && { errors: validationErrors }),
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    this.logger.error('Request failed', {
      ...errorResponse,
      body: request.body,
      error: exception instanceof Error ? exception.stack : undefined,
    });

    response.status(status).json(errorResponse);
  }
}
