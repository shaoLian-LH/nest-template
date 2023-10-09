import { Module } from '@nestjs/common';
import { join } from 'path';
import { loadConfig } from './config/app/configuration';
import { NacosModule } from './modules/nacos/nacos.module';
import { ConfigModule } from '@nestjs/config';
import { HelloModule } from './modules/hello/hello.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: loadConfig()
		}),
		NacosModule.forRoot({
			namingClientOptions: {
				serverList: ['localhost:8848'],
				serviceName: 'nestjs.template.service.a',
				ip: 'localhost',
				port: 3100
			},
			configClientOptions: {
				serverAddr: 'localhost:8848',
				cacheDir: join(__dirname, '../nacos-cahce'),
			},
			namespace: 'shaolian',
			username: 'local',
			password: 'local',
		}),
		HelloModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
