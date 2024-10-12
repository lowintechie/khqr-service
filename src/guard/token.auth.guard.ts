import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { TokenService } from 'src/services/token.service';

@Injectable()
export class TokenAuthGuard implements CanActivate {
  private readonly logger = new Logger(TokenAuthGuard.name);

  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    
    if (!token) {
      this.logger.warn('No token provided in the request');
      throw new UnauthorizedException('No token provided');
    }

    this.logger.debug(`Extracted token: ${token.substring(0, 10)}...`);

    try {
      const isValid = await this.tokenService.validateToken(token);
      if (!isValid) {
        this.logger.warn('Token validation returned false');
        throw new UnauthorizedException('Invalid token');
      }
      this.logger.debug('Token successfully validated');
      return true;
    } catch (error) {
      this.logger.error('Error during token validation', error);
      throw new UnauthorizedException('Token validation failed');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const authHeader = request.headers.authorization;
    this.logger.debug(`Authorization header: ${authHeader}`);
    const [type, ...tokenParts] = authHeader?.split(' ') ?? [];
    const token = tokenParts.join(' '); 
    return type === 'Bearer' ? token : undefined;
  }
}