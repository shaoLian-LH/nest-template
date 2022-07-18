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

export class CommonHttpException<
  T extends HttpStatus,
> extends CustomHttpException {
  translated: boolean;
  payload: Record<string, any>;
  constructor(
    httpEnum: ICustomHttpEnum,
    payload: IHttpEnumPayloadMap<T>,
    translated = true,
  ) {
    super('common', httpEnum.tag, httpEnum.status);
    this.translated = translated;
    this.payload = payload;
  }
}

export class V1HttpException extends CustomHttpException {
  constructor(response: string | Record<string, any>, status: number) {
    super('1.0', response, status);
  }
}
