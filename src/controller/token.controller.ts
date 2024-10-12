import { Controller, Post, Body } from '@nestjs/common';
import { TokenService } from 'src/services/token.service';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('generate')
  async generateToken(@Body('userId') userId: number, @Body('expiresIn') expiresInDays: number) {
    const token = await this.tokenService.generateToken(userId, expiresInDays);
    return { token };
  }
}