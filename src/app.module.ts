import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/users/user.module';
import { Module } from '@nestjs/common';
import { I18nModule, QueryResolver, AcceptLanguageResolver } from 'nestjs-i18n';
import { join } from 'path';
import { loadConfig } from './config/app/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: loadConfig(),
		}),
		I18nModule.forRoot({
			fallbackLanguage: 'zh-CN',
			loaderOptions: {
				path: join(__dirname, 'config', 'i18n'),
				watch: true,
			},
			resolvers: [
				new AcceptLanguageResolver(),
				new QueryResolver(['lang', 'l']),
			],
		}),
		PrismaModule,
		UserModule,
		// SessionModule,
	],
	controllers: [],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
	],
})
export class AppModule { }
