import { IsString, IsNumber, IsOptional, IsIn } from 'class-validator';
import { Currency } from 'src/constants/khrq';
import { BaseOptionalData } from 'src/interface/bakong-properties';

export class IndividualDto implements BaseOptionalData {
  @IsString()
  bakongAccountID: string;

  @IsString()
  accName: string;

  @IsString()
  @IsIn([Currency.USD, Currency.KHR], {
    message: 'Currency must be either USD or KHR',
  })
  currency: Currency.USD | Currency.KHR;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  merchantCity: string;
}
