import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CakesService } from './cakes.service';
import { CakeRepository } from './cakes.repository';
import { CakesController } from './cakes.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([CakeRepository]), AuthModule],
  providers: [CakesService],
  controllers: [CakesController],
})
export class CakesModule {}
