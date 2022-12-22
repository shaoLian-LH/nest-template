import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../../entities/user.entity';
import { UserRepositoryService } from './user-repository.service';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepositoryService) {}

  async register(userData: CreateUserDto): Promise<User> {
    return this.userRepository.register(userData);
  }

  async listUsers(): Promise<Array<User>> {
    return this.userRepository.find();
  }
}
