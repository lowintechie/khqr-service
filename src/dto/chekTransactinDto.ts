import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckTransactionDto {
  @ApiProperty({ description: 'MD5 hash of the transaction' })
  @IsString()
  @IsNotEmpty()
  md5: string;

  @ApiProperty({ description: 'Bakong authentication token' })
  @IsString()
  @IsNotEmpty()
  bakongToken: string;
}
