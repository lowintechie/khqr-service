import { ApiProperty } from '@nestjs/swagger';

class KhqrData {
  @ApiProperty({ description: 'Base64 encoded QR code image' })
  qrCodeImage: string;

  @ApiProperty({ description: 'MD5 hash of the QR code' })
  md5: string;
}

export class KhqrResponse {
  @ApiProperty({ description: 'Indicates if the operation was successful' })
  success: boolean;

  @ApiProperty({ description: 'Response data', type: KhqrData })
  data: KhqrData;

  @ApiProperty({ description: 'Response message' })
  message: string;
}
