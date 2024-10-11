import { Module } from '@nestjs/common';
import { KhqrController } from 'src/controller/khqr.controller';
import { KhqrService } from 'src/services/khqr.service';


@Module({
  imports: [],
  controllers: [KhqrController],
  providers: [KhqrService],
})
export class KhqrModule  {}
