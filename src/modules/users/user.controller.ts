import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { V1HttpException } from '../../common/advance/http-exception.v1.exception';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@ApiTags('基础服务')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() userData: CreateUserDto) {
    const res = await this.userService.register(userData);
    if (res) {
      return res;
    }
    throw new V1HttpException('创建失败', 503);
  }

  @Get()
  async getAllUser() {
    return this.userService.listUsers();
  }
}
