import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cake } from '../../entities/cake.entity';
import { CakeRepository } from './cakes.repository';
import { PublishCakeDto } from './dto/publish-cake.dto';

@Injectable()
export class CakesService {
  constructor(
    @InjectRepository(CakeRepository)
    private readonly cakeRepository: CakeRepository,
  ) {}

  async publishCakeUnderBrand(cakeData: PublishCakeDto): Promise<Cake> {
    return this.cakeRepository.publishCake(cakeData);
  }
}
