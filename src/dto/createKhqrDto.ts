import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { IndividualDto } from './individual';
import { MerchantDto } from './merchant';

export class CreateKhqrDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['personal', 'merchant'])
  type: string;

  
  @ValidateNested()
  @Type((opts) => {
    return opts.object.type === 'personal' ? IndividualDto : MerchantDto;
  })
  data: IndividualDto | MerchantDto;
}
