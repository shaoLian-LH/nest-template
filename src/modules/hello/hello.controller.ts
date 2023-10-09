import { Controller, Get } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller('hello')
export class HelloController {
	@Get('say')
	@EventPattern('call')
	sayHello(): string {
		return 'Hello World!';
	}
}
