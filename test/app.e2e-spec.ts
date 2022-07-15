import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppV1Module } from '../src/modules/v1/app.v1.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppV1Module],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
});
