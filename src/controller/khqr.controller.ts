import {
  Body,
  Controller,
  Logger,
  Post,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { CheckTransactionDto } from 'src/dto/chekTransactinDto';
import { CreateKhqrDto } from 'src/dto/createKhqrDto';
import { KhqrService } from 'src/services/khqr.service';
import { KhqrResponse } from 'src/response/khqr-response.class';
import { TransactionResponse } from 'src/response/transaction-response.class';

@ApiTags('KHQR')
@Controller('khqr')
export class KhqrController {
  private readonly logger = new Logger(KhqrController.name);

  constructor(private readonly khqrService: KhqrService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Generate a KHQR code' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'KHQR code generated successfully',
    type: KhqrResponse
  })
  @ApiBadRequestResponse({
    description: 'Invalid input',
    schema: {
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Bad Request Exception' },
        error: { type: 'string', example: 'Validation failed' },
        details: { type: 'array', items: { type: 'string' } }
      }
    }
  })
  async createKhqr(
    @Body(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true
    })) createKhqrDto: CreateKhqrDto
  ): Promise<KhqrResponse> {
    this.logger.log(`Creating KHQR for type: ${createKhqrDto.type}`);

    try {
      const result = await this.khqrService.getKhqr(
        createKhqrDto.type,
        createKhqrDto.data
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
        type: createKhqrDto.type
      });
      throw error;
    }
  }

  @Post('check-transaction')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Check transaction status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transaction check completed',
    type: TransactionResponse,
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  async checkTransaction(
    @Body() checkTransactionDto: CheckTransactionDto,
  ): Promise<TransactionResponse> {
    this.logger.log(
      `Checking transaction with MD5: ${checkTransactionDto.md5}`,
    );

    try {
      const result = await this.khqrService.checkTransaction(
        checkTransactionDto.md5,
        checkTransactionDto.bakongToken,
      );

      this.logger.debug('Transaction check completed', {
        md5: checkTransactionDto.md5,
      });

      return {
        success: true,
        data: result,
        message: 'Transaction check completed successfully',
      };
    } catch (error) {
      this.logger.error('Failed to check transaction', {
        error: error.message,
        stack: error.stack,
        md5: checkTransactionDto.md5,
      });
      throw error;
    }
  }
}
