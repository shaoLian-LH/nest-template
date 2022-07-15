import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import {
  getI18nContextFromArgumentsHost,
  I18nValidationException,
} from 'nestjs-i18n';

@Catch(I18nValidationException)
export class I18nExceptionFilter<T extends I18nValidationException>
  implements ExceptionFilter
{
  catch(exception: T, host: ArgumentsHost) {
    if (!(exception instanceof I18nValidationException)) return;

    const i18n = getI18nContextFromArgumentsHost(host);
    const requestCtx = host.switchToHttp();
    const response = requestCtx.getResponse<Response>();
    const { errors } = exception;
    const specialTansKeys = ['whitelistValidation'];
    const newErrors = errors
      .map((error) => {
        const constrainsDictionary = Object.entries(error.constraints);
        if (!constrainsDictionary.length) return undefined;
        const transContent = constrainsDictionary[0][1].replace('|{}', '');
        const transKey = constrainsDictionary[0][0];
        const { property } = error;
        const args = { property };
        if (specialTansKeys.includes(transKey)) {
          return i18n.t(`common.${transKey}`, { args });
        }
        return i18n.t(transContent, { args });
      })
      .filter((notUndefinedValue) => notUndefinedValue);

    response.status(400).json({
      code: 50400,
      success: false,
      data: newErrors,
      timestamp: new Date().toISOString(),
      version: i18n.t('common.DEFAULT_VERSION'),
      msg: i18n.t('common.REQUEST_PARAM_VALIDATION_FAILED'),
    });
  }
}
