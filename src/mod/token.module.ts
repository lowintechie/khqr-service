import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenService } from 'src/services/token.service';
import { JwtModule } from '@nestjs/jwt';
import { TokenController } from 'src/controller/token.controller';
import { UserToken } from 'src/entity/user-token.entity';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'yourSecretKey',
            signOptions: { expiresIn: '30d' }, // Set a default expiration
        }),
        TypeOrmModule.forFeature([UserToken]),
    ],
    controllers: [TokenController],
    providers: [TokenService],
    exports: [TokenService],
})
export class TokenModule { }