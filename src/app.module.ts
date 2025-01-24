import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/users/user.module';
import { Module } from '@nestjs/common';
import { I18nModule, QueryResolver, AcceptLanguageResolver } from 'nestjs-i18n';
import { join } from 'path';
import { loadConfig } from './config/app/configuration';
import { SessionModule } from './modules/session/session.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
	imports: [
		ConfigModule.forRoot({
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
	providers: [],
})
export class AppModule { }
