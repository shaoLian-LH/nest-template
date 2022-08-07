import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../../entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async register(userData: CreateUserDto): Promise<User> {
    return this.userRepository.register(userData);
  }

  async listUsers(): Promise<Array<User>> {
    return this.userRepository.find();
  }
}
