import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KhqrModule } from 'src/mod/khrq.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenModule } from './mod/token.module';
import { UserToken } from 'src/entity/user-token.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'aws-0-ap-southeast-1.pooler.supabase.com',       
      port: 6543,     
      username: 'postgres.hycxomssfjrnpupkaepm',   
      password: 'IYPKKww52OOXEihr',   
      database: 'postgres',   
      entities: [UserToken],           
      synchronize: true,               
    }),
    KhqrModule,
    TokenModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
