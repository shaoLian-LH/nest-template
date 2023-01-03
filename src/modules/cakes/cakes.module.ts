import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CakesService } from './cakes.service';
import { CakeRepositoryService } from './cakes-repository.service';
import { CakesController } from './cakes.controller';
import { AuthModule } from '../auth/auth.module';
import { Cake } from '../../entities/cake.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Cake]), AuthModule],
	providers: [CakeRepositoryService, CakesService],
	controllers: [CakesController],
})
export class CakesModule {}
