import { CakesService } from './cakes.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PublishCakeDto } from './dto/publish-cake.dto';
import { Cake } from '../../entities/cake.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { User } from '../../entities/user.entity';

@ApiTags('蛋糕')
@Controller('cakes')
@UseGuards(AuthGuard())
export class CakesController {
	constructor(private readonly cakesService: CakesService) {}

	@Post()
	async publishNewCake(
		@Body() cakeData: PublishCakeDto,
		@GetUser() user: User,
	): Promise<Cake> {
		return this.cakesService.publishCakeUnderBrand(cakeData, user);
	}
}
