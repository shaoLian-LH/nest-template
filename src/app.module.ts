import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/users/user.module';
import { Module } from '@nestjs/common';
import { I18nModule, QueryResolver, AcceptLanguageResolver } from 'nestjs-i18n';
import { join } from 'path';
import {
  IConfiguration,
  IMysqlDatabaseConfiguration,
  loaderForDevelopment,
} from './config/app/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [loaderForDevelopment],
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
      useFactory: (configService: ConfigService<IConfiguration>) => {
        const dbConfig =
          configService.get<IMysqlDatabaseConfiguration>('mysql');
        return {
          type: 'mysql',
          autoLoadEntities: true,
          synchronize: true,
          host: dbConfig.host,
          port: dbConfig.port,
          database: dbConfig.database,
          username: dbConfig.username,
          password: dbConfig.password,
          debug: process.env.NODE_ENV === 'development',
        };
      },
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
