import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { KhqrType } from 'src/constants/khrq';
import { IndividualDto } from './individual';
import { MerchantDto } from './merchant';

export class CreateKhqrDto {
  @ApiProperty({ enum: KhqrType, description: 'Type of KHQR code' })
  @IsEnum(KhqrType)
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'KHQR data',
    oneOf: [
      { $ref: '#/definitions/IndividualDto' },
      { $ref: '#/definitions/MerchantDto' }
    ]
  })
  @ValidateNested()
  @Type((opts) => {
    return opts.object.type === KhqrType.Individual ? IndividualDto : MerchantDto;
  })
  data: IndividualDto | MerchantDto;
}
