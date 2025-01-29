import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { i18nValidationErrorFactory } from 'nestjs-i18n';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { I18nExceptionFilter } from './common/filters/i18n-exception.filter';
import { AppModule } from './app.module';
import chalk = require('chalk');
import { ConfigService } from '@nestjs/config';
import { AppConfiguration, Configuration } from './config/app/configuration';
import { INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
const dotEnv = require('dotenv');
const path = require('node:path');

export const setAppConfigs = (app: INestApplication) => {
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

	app.useGlobalFilters(
		new HttpExceptionFilter(), // 统一处理抛错
		new I18nExceptionFilter(), // 自定义处理i18n错误
	);

	app.useGlobalInterceptors(
		new WrapResponseInterceptor(), // 成功操作的内容自动包裹成特定json格式
	);
};

async function bootstrap() {
	// 加载环境变量，优先加载 .env，然后根据环境加载对应的配置
	dotEnv.config({ override: true });
	if (process.env.NODE_ENV) {
		dotEnv.config({
			path: `.env.${process.env.NODE_ENV.toLowerCase()}`,
			override: true,
		});
	}

	const logger = new Logger();
	// 添加全局未捕获异常处理
	process.on('unhandledRejection', (reason, promise) => {
		logger.error(`未捕获的Promise异常: ${reason}`, promise);
	});

	process.on('uncaughtException', (error) => {
		logger.error(`未捕获的异常: ${error.message}`, error.stack);
		// 给进程一些时间来记录错误
		setTimeout(() => process.exit(1), 1000);
	});

	const app: NestExpressApplication = await NestFactory.create(AppModule, {
		logger: ['error', 'warn', 'log', 'debug', 'verbose'],
	});

	const configService = app.get<ConfigService<Configuration>>(ConfigService);
	const appConfig = configService.get<AppConfiguration>('APP');

	setAppConfigs(app);

	// api文档配置
	const docsConfig = new DocumentBuilder()
		.setTitle('nest-template-with-prisma')
		.setDescription('nest template API description')
		.setVersion('1.0.0')
		.build();
	const docs = SwaggerModule.createDocument(app, docsConfig);
	const swaggerPrefix = '/swagger';
	SwaggerModule.setup(swaggerPrefix, app, docs);
	app.useStaticAssets(path.join(__dirname, "swagger-ui-dist/"), {
		prefix: "/swagger"
	})

	const protocolAndIp = `${appConfig.protocol}://${appConfig.ip}`;

	const port = process.env.SERVICE_PORT || 3000;
	await app.listen(port).then(() => {
		const swaggerTag = swaggerPrefix.replace(/^\//, '');
		const swaggerAddress = `${protocolAndIp}:${port}/${swaggerTag}`;
		logger.log(
			`${chalk.yellow('[SwaggerDocs]')} ${chalk.green(swaggerAddress)}`,
		);
		logger.log(`应用成功启动于端口: ${port}`);
	}).catch((error) => {
		logger.error(`应用启动失败: ${error.message}`, error.stack);
		throw error;
	});
}
bootstrap();
