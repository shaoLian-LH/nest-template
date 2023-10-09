import { Module } from '@nestjs/common';
import { HelloService } from './hello.service';
import { NacosModule } from '../nacos/nacos.module';
import { HelloController } from './hello.controller';

@Module({
	imports: [NacosModule],
  providers: [HelloService],
  controllers: [HelloController]
})
export class HelloModule {}
