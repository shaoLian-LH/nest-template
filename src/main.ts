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
import path = require('path');

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
	// 设置所有接口前缀默认增加字段
	app.setGlobalPrefix('/api');

	app.useGlobalFilters(
		new HttpExceptionFilter(), // 统一处理抛错
		new I18nExceptionFilter(), // 自定义处理i18n错误
	);

	app.useGlobalInterceptors(
		new WrapResponseInterceptor(), // 成功操作的内容自动包裹成特定json格式
	);
};

async function bootstrap() {
	const logger = new Logger();
	const app: NestExpressApplication = await NestFactory.create(AppModule);
	const configService = app.get<ConfigService<Configuration>>(ConfigService);
	const appConfig = configService.get<AppConfiguration>('APP');

	setAppConfigs(app);

	// api文档配置
	const docsConfig = new DocumentBuilder()
		.setTitle('nest-template')
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

	await app.listen(appConfig.port).then(() => {
		const swaggerTag = swaggerPrefix.replace(/^\//, '');
		const swaggerAddress = `${protocolAndIp}:${appConfig.port}/${swaggerTag}`;
		logger.log(
			`${chalk.yellow('[SwaggerDocs]')} ${chalk.green(swaggerAddress)}`,
		);
	});
}
bootstrap();
