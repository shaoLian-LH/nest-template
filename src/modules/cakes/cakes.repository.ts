import { HttpStatus } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CommonHttpException } from '../../common/advance/http-exception.v1.exception';
import { HTTP_ERROR_FLAG } from '../../common/enumeration/custom-http.enum';
import { Cake } from '../../entities/cake.entity';
import { User } from '../../entities/user.entity';
import { PublishCakeDto } from './dto/publish-cake.dto';

@EntityRepository(Cake)
export class CakeRepository extends Repository<Cake> {
  async publishCake(cakeData: PublishCakeDto, userData: User): Promise<Cake> {
    const cakeHasExited = await this.findOne({
      ...cakeData,
      deleted: 0,
    });

    if (cakeHasExited) {
      throw new CommonHttpException<HttpStatus.CREATED>(
        HTTP_ERROR_FLAG.CREATED,
        { entity: 'cake', value: cakeData },
        { customI18Tag: 'repository.cake.CREATED' },
      );
    }

    const newCake = this.create({
      ...cakeData,
      created_user_id: userData.id,
      updated_user_id: userData.id,
    });
    return this.save(newCake);
  }
}
