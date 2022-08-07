import { HttpStatus } from '@nestjs/common';

export interface ICustomHttpEnum {
  tag: string;
  status: number;
  args?: Record<string, any>;
}

export type IHttpEnumPayloadMap<T> = T extends HttpStatus.NOT_FOUND
  ? { id?: any; entity: string }
  : T extends HttpStatus.CREATED
  ? { entity: string; value: string }
  : Record<string, any>;

export const HTTP_ERROR_FLAG: Record<string, ICustomHttpEnum> = {
  NOT_FOUND: {
    tag: 'NOT_FOUND',
    status: HttpStatus.NOT_FOUND,
  },
  UNAUTHORIZED: {
    tag: 'UNAUTHORIZED',
    status: HttpStatus.UNAUTHORIZED,
  },
  CREATED: {
    tag: 'CREATE',
    status: HttpStatus.CREATED,
  },
};
