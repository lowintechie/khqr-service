import { IsString, IsNumber, IsOptional } from 'class-validator';

export class MerchantDto {
  @IsString()
  bakongAccountID: string;

  @IsString()
  merchantID: string;

  @IsString()
  acquiringBank: string;

  @IsString({
    message: 'Currency must be either USD or KHR',
  })
  currency: string;

  @IsNumber()
  amount: number;

  @IsString()
  merchantName: string;

  @IsString()
  merchantCity: string;

  @IsString()
  @IsOptional()
  billNumber: string;

  @IsString()
  @IsOptional()
  mobileNumber: string;

  @IsString()
  @IsOptional()
  storeLabel: string;

  @IsString()
  @IsOptional()
  terminalLabel: string;

  @IsString()
  @IsOptional()
  purposeOfTransaction: string;

  @IsString()
  @IsOptional()
  upiAccountInfo: string;

  @IsString()
  @IsOptional()
  merchantAlternateLangUsagePreference: string;

  @IsString()
  @IsOptional()
  merchantNameAlternateLanguage: string;
}
