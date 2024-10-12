import { IsString, IsNumber, IsOptional, IsIn, IsNotEmpty } from 'class-validator';
import { BaseOptionalData } from 'src/interface/bakong-properties';

export class IndividualDto implements BaseOptionalData {
  @IsString()
  @IsNotEmpty()
  bakongAccountID: string;

  @IsString()
  @IsNotEmpty()
  accName: string;

  @IsString()
  accountInformation: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['USD', 'KHR'], {
    message: 'Currency must be either USD or KHR',
  })
  currency: string;

  @IsNumber()
  @IsOptional()
  amount: number;

  @IsString()
  @IsOptional()
  address: string;
}
