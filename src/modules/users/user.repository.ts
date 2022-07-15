import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async register(userData: CreateUserDto): Promise<User> {
    const newUser = this.create(userData);
    await this.save(newUser);
    return newUser;
  }
}
