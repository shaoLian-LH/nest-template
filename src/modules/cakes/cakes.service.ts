import { Injectable } from '@nestjs/common';
import { Cake } from '../../entities/cake.entity';
import { User } from '../../entities/user.entity';
import { CakeRepositoryService } from './cakes-repository.service';
import { PublishCakeDto } from './dto/publish-cake.dto';

@Injectable()
export class CakesService {
  constructor(private readonly cakeRepositoryService: CakeRepositoryService) {}

  async publishCakeUnderBrand(
    cakeData: PublishCakeDto,
    user: User,
  ): Promise<Cake> {
    return this.cakeRepositoryService.publishCake(cakeData, user);
  }
}
