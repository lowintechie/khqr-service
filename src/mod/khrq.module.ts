import { Module } from '@nestjs/common';
import { KhqrController } from 'src/controller/khqr.controller';
import { TokenAuthGuard } from 'src/guard/token.auth.guard';
import { KhqrService } from 'src/services/khqr.service';
import { TokenModule } from './token.module';


@Module({
  imports: [TokenModule],
  controllers: [KhqrController],
  providers: [KhqrService, TokenAuthGuard],
})
export class KhqrModule  {}
