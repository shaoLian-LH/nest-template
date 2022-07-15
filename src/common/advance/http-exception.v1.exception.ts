import { HttpException } from '@nestjs/common';

export class CustomHttpException extends HttpException {
  private version: string;
  constructor(
    version: string,
    response: string | Record<string, any>,
    status: number,
  ) {
    super(response, status);
    this.version = version;
  }

  getVersion() {
    return this.version;
  }
}

export class V1HttpException extends CustomHttpException {
  constructor(response: string | Record<string, any>, status: number) {
    super('1.0', response, status);
  }
}
