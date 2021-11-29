import {
  HttpStatus,
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
@Catch()
export default class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException | any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as any).message
        : 'INTERNAL_SERVER_ERROR';

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) Logger.error(exception);

    response.status(status).json({
      statusCode: status,
      message,
      path: request.url,
    });
  }
}
