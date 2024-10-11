import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KhqrModule } from 'src/mod/khrq.module';


@Module({
  imports: [KhqrModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
