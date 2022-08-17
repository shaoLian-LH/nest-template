import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cake } from '../../entities/cake.entity';
import { User } from '../../entities/user.entity';
import { CakeRepository } from './cakes.repository';
import { PublishCakeDto } from './dto/publish-cake.dto';

@Injectable()
export class CakesService {
  constructor(
    @InjectRepository(CakeRepository)
    private readonly cakeRepository: CakeRepository,
  ) {}

  async publishCakeUnderBrand(
    cakeData: PublishCakeDto,
    user: User,
  ): Promise<Cake> {
    return this.cakeRepository.publishCake(cakeData, user);
  }
}
