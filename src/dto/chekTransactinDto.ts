import { IsNotEmpty, IsString } from 'class-validator';

export class CheckTransactionDto {
  @IsString()
  @IsNotEmpty()
  md5: string;


  @IsString()
  @IsNotEmpty()
  bakongToken: string;
}
