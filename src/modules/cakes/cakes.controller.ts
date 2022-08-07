import { CakesService } from './cakes.service';
import { Controller, UseGuards } from '@nestjs/common';
import { PublishCakeDto } from './dto/publish-cake.dto';
import { Cake } from '../../entities/cake.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('蛋糕')
@Controller('cakes')
@UseGuards(AuthGuard())
export class CakesController {
  constructor(private readonly cakesService: CakesService) {}

  async publishNewCake(cakeData: PublishCakeDto): Promise<Cake> {
    return this.cakesService.publishCakeUnderBrand(cakeData);
  }
}
