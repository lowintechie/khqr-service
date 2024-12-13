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
      host: 'ep-dark-silence-a5f8t498.us-east-2.aws.neon.tech',
      port: 5432,
      username: 'khqr_service_owner',
      password: 'Ewvroi6UqLX0',
      database: 'khqr_service',
      ssl: true, 
      extra: {
        ssl: {
          rejectUnauthorized: true, 
        },
      },
      synchronize: true, 
      entities: [
        UserToken,
      ],
    }),
    KhqrModule,
    TokenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
