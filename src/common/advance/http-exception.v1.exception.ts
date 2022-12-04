import { HttpException, HttpStatus } from '@nestjs/common';
import {
  ICustomHttpEnum,
  IHttpEnumPayloadMap,
} from '../enumeration/custom-http.enum';

export class CustomHttpException extends HttpException {
  version: string;

  constructor(
    version: string,
    response: string | Record<string, any>,
    status: number,
  ) {
    super(response, status);
    this.version = version;
  }
}

interface CommonHttpExceptionOptions {
  translated?: boolean;
  customI18Tag?: string;
}

export class CommonHttpException<
  T extends HttpStatus,
> extends CustomHttpException {
  customOptions: CommonHttpExceptionOptions;
  payload: Record<string, any>;
  constructor(
    httpEnum: ICustomHttpEnum,
    payload: IHttpEnumPayloadMap<T> | Record<string, any>,
    options?: CommonHttpExceptionOptions,
  ) {
    super('common', httpEnum.tag, httpEnum.status);
    this.payload = payload;
    const exceptionOptions: CommonHttpExceptionOptions = Object.assign(
      { translated: true },
      options,
    );
    this.customOptions = exceptionOptions;
  }
}

export class V1HttpException extends CustomHttpException {
  constructor(response: string | Record<string, any>, status: number) {
    super('1.0', response, status);
  }
}
