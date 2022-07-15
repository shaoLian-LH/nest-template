import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { getI18nContextFromArgumentsHost } from 'nestjs-i18n';
import { CustomHttpException } from '../advance/http-exception.v1.exception';

@Catch(CustomHttpException, HttpException)
export class HttpExceptionFilter<T extends CustomHttpException | HttpException>
  implements ExceptionFilter
{
  catch(exception: T, host: ArgumentsHost) {
    const i18n = getI18nContextFromArgumentsHost(host);
    const requestCtx = host.switchToHttp();
    const response = requestCtx.getResponse<Response>();
    const code = exception.getStatus();
    const msg = exception.getResponse();

    const finalResponse = {
      code,
      success: false,
      data: null,
      timestamp: new Date().toISOString(),
      version: i18n.t('common.DEFAULT_VERSION'),
      msg: {},
    };

    if (exception instanceof CustomHttpException) {
      const version = exception.getVersion();
      if (version) {
        finalResponse.version = exception.getVersion();
      }
      finalResponse.msg = typeof msg === 'string' ? { msg } : (msg as object);
    } else if (exception instanceof HttpException) {
      finalResponse.msg = exception.message;
    }
    response.status(code).json(finalResponse);
  }
}
