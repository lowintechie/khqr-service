import {
  Body,
  Controller,
  Logger,
  Post,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  HttpException,
  UseGuards,
} from '@nestjs/common';

import { CheckTransactionDto } from 'src/dto/chekTransactinDto';
import { CreateKhqrDto } from 'src/dto/createKhqrDto';
import { KhqrService } from 'src/services/khqr.service';
import { KhqrResponse } from 'src/response/khqr-response.class';
import checkBakongTransaction from 'src/utils/check-transaction';
import { generateDeeplink } from 'src/utils/deepLink';
import { TokenAuthGuard } from 'src/guard/token.auth.guard';


@Controller('khqr')
@UseGuards(TokenAuthGuard)
export class KhqrController {
  private readonly logger = new Logger(KhqrController.name);
  constructor(private readonly khqrService: KhqrService) { }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createKhqr(
    @Body() param: CreateKhqrDto
  ): Promise<KhqrResponse> {
    this.logger.log(`Creating KHQR for type: ${param.type}`);

    try {
      const result = await this.khqrService.getKhqr(
        param.type,
        param.data
      );

      this.logger.debug('KHQR created successfully', { md5: result.md5 });

      return {
        success: true,
        data: result,
        message: 'KHQR code generated successfully'
      };
    } catch (error) {
      this.logger.error('Failed to create KHQR', {
        error: error.message,
        stack: error.stack,
        type: param.type
      });
      throw error;
    }
  }

  // Check transaction
  @Post('check-transaction')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async checkTransaction(
    @Body() param: CheckTransactionDto,
  ): Promise<object> {
    this.logger.log(
      `Checking transaction with MD5: ${param.md5}`,
    );
    try {
      return await checkBakongTransaction(
        param.bakongToken,
        param.md5,
      )
    } catch (error) {
      this.logger.error('Failed to check transaction', {
        error: error.message,
        stack: error.stack,
        md5: param.md5,
      });
      throw error;
    }
  }

  @Post('deeplink')
  async generateDeeplinkEndpoint(@Body() body: GenerateDeeplinkDto): Promise<{ shortLink: string }> {
    try {
      const shortLink = await generateDeeplink(body);
      return { shortLink };
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException('An unexpected error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
