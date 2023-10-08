import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/users/user.module';
import { Module } from '@nestjs/common';
import { I18nModule, QueryResolver, AcceptLanguageResolver } from 'nestjs-i18n';
import { join } from 'path';
import {
	Configuration,
	MysqlDatabaseConfiguration,
	loadConfig,
} from './config/app/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionModule } from './modules/session/session.module';
import { CakesModule } from './modules/cakes/cakes.module';
import Entities from './entities'

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
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService<Configuration>) => {
				const dbConfig =
					configService.get<MysqlDatabaseConfiguration>('DB_CONFIG');
				return {
					type: 'mysql',
					autoLoadEntities: false,
					entities: Entities,
					synchronize: dbConfig.synchronize,
					host: dbConfig.host,
					port: dbConfig.port,
					database: dbConfig.database,
					username: dbConfig.username,
					password: dbConfig.password,
					debug: dbConfig.debug,
					dropSchema: dbConfig.dropSchema,
					logger: 'advanced-console',
					timezone: '+08:00',
				};
			},
		}),
		UserModule,
		SessionModule,
		CakesModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
