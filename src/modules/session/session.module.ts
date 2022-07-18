import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';

@Module({
  imports: [AuthModule],
  controllers: [SessionController],
  providers: [SessionService],
})
export class SessionModule {}
