import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import * as fs from 'fs';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { ValidationPipe } from '@nestjs/common';
import { i18nValidationErrorFactory } from 'nestjs-i18n';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { I18nExceptionFilter } from '../src/common/filters/i18n-exception.filter';
import { WrapResponseInterceptor } from '../src/common/interceptors/wrap-response.interceptor';

let app: INestApplication;
let mod: TestingModule;
let dataSource: DataSource;

const loadFixtures = async (sqlFileName: string) => {
	const sqlFilePath = path.join(__dirname, 'fixtures', sqlFileName);
	const sql = fs
		.readFileSync(sqlFilePath, { encoding: 'utf-8' })
		.replace(/\r*\n/g, '');
	const queryRunner = dataSource.createQueryRunner('master');
	const queries = sql.split(';').filter((v) => v);
	for (const c of queries) {
		await queryRunner.query(c);
	}
};

describe('e2e测试（User）', () => {
	beforeAll(async () => {
		mod = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = mod.createNestApplication();

		app.enableCors();
		// 接口参数检查
		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true, // 只接受dto需要的参数
				forbidNonWhitelisted: true, // 传输了dto不需要的参数时直接报错
				transform: true, // 根据Dto约束将接受内容转换为对应类型
				exceptionFactory: i18nValidationErrorFactory, // i18n转换报错内容为对应语言
			}),
		);
		// 设置所有接口前缀默认增加字段
		app.setGlobalPrefix('/api');

		app.useGlobalFilters(
			new HttpExceptionFilter(), // 统一处理抛错
			new I18nExceptionFilter(), // 自定义处理i18n错误
		);

		app.useGlobalInterceptors(
			new WrapResponseInterceptor(), // 成功操作的内容自动包裹成特定json格式
		);

		await app.init();

		dataSource = app.get<DataSource>(DataSource);

		await loadFixtures('user.sql');
	});

	afterAll(async () => {
		await app.close();
	});

	it('用户能正常登录', async () => {
		const server = app.getHttpServer();
		const req = await request(server)
			.post('/api/session')
			.send({
				username: 'admin',
				password: '!Aadmin123',
			})
			.expect(201)
			.then((resp) => {
				return resp.body.data;
			});
		const token = req.token;
		expect(token).toBeTruthy();
	});
});
