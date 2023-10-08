import { Module } from '@nestjs/common';
import { I18nModule, QueryResolver, AcceptLanguageResolver } from 'nestjs-i18n';
import { join } from 'path';
import { MysqlDatabaseConfiguration, loadConfig } from './config/app/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/users/user.module';
import { SessionModule } from './modules/session/session.module';
import { CakesModule } from './modules/cakes/cakes.module';
import Entities from './entities'
import { NacosModule } from './modules/nacos/nacos.module';
import { NacosConfigClient } from 'nacos';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: loadConfig()
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
		NacosModule.forRoot({
			namingClientOptions: {
				serverList: ['localhost:8848'],
				serviceName: 'nestjs.template.main',
				ip: 'localhost',
				port: 3000
			},
			configClientOptions: {
				serverAddr: 'localhost:8848',
				cacheDir: join(__dirname, '../nacos-cahce'),
			},
			namespace: 'shaolian',
			username: 'local',
			password: 'local',
		}),
		TypeOrmModule.forRootAsync({
			inject: [NacosConfigClient],
			useFactory: async (nacosConfigClient: NacosConfigClient) => {
				const configStr = await nacosConfigClient.getConfig('COMMON', 'DEFAULT_GROUP');
				const config = JSON.parse(configStr)
				const dbConfig = config['DB_CONFIG'] as MysqlDatabaseConfiguration;

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
