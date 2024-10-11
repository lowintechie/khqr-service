import { ApiProperty } from '@nestjs/swagger';

class TransactionData {
  @ApiProperty({ description: 'Transaction ID' })
  transactionId: string;

  @ApiProperty({ description: 'Transaction amount' })
  amount: number;

  @ApiProperty({ description: 'Transaction date' })
  date: string;
}

export class TransactionResponse {
	@ApiProperty({ description: 'Indicates if the operation was successful' })
	success: boolean;

	@ApiProperty({ description: 'Response data', type: TransactionData })
	data: TransactionData;

	@ApiProperty({ description: 'Response message' })
	message: string;
  }
