import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserToken } from 'src/entity/user-token.entity';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
  ) {}

  async validateToken(token: string): Promise<boolean> {
    this.logger.debug(
      `Starting token validation for: ${token.substring(0, 10)}...`,
    );

    try {
      // Step 1: JWT Verification
      let payload;
      try {
        payload = this.jwtService.verify(token);
        this.logger.debug('JWT verification passed', payload);
      } catch (jwtError) {
        this.logger.error('JWT verification failed', jwtError);
        return false;
      }

      // Step 2: Database Check
      let userToken;
      try {
        userToken = await this.userTokenRepository.findOne({
          where: { token },
        });
        if (!userToken) {
          this.logger.warn('Token not found in database');
          return false;
        }
        this.logger.debug('Token found in database', userToken);
      } catch (dbError) {
        this.logger.error('Database query failed', dbError);
        return false;
      }

      // Step 3: Expiration Check
      const now = new Date();
      const isValid = userToken.expires_at > now;

      this.logger.debug(`Token expiration: ${userToken.expires_at}`);
      this.logger.debug(`Current time: ${now}`);
      this.logger.debug(`Is token valid? ${isValid}`);

      return isValid;
    } catch (error) {
      this.logger.error('Unexpected error during token validation', error);
      return false;
    }
  }

  async generateToken(userId: string, expiresInDays: number): Promise<string> {
    const payload = { userId };
    const token = this.jwtService.sign(payload, {
      expiresIn: `${expiresInDays}d`,
    });
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const userToken = this.userTokenRepository.create({
      user_id: userId,
      token,
      expires_at: expiresAt,
    });

    await this.userTokenRepository.save(userToken);
    this.logger.debug(
      `Generated token for user ${userId}, expires at ${expiresAt}`,
    );
    return token;
  }
}
