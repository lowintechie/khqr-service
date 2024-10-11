import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { BakongKHQR, IndividualInfo, MerchantInfo } from 'bakong-khqr';
import * as QRCode from 'qrcode';
import { KhqrType } from 'src/constants/khrq';
import { IndividualDto } from 'src/dto/individual';
import { MerchantDto } from 'src/dto/merchant';
import { BaseOptionalData } from 'src/interface/bakong-properties';
import { checkTransactionByMd5 } from 'src/utils/khqrRest';


interface GenerateResult {
  qr: string;
  md5: string;
}

@Injectable()
export class KhqrService {
  private readonly logger = new Logger(KhqrService.name);
  private readonly khqr: BakongKHQR;

  constructor() {
    this.khqr = new BakongKHQR();
  }

  async getKhqr(type: string, data: IndividualDto | MerchantDto): Promise<any> {
    this.logger.debug(`Generating KHQR for type: ${type}`, { data });

    try {
      let result: GenerateResult;

      if (type === KhqrType.Individual) {
        result = await this.generateKhqrForIndividual(data as IndividualDto);
      } else if (type === KhqrType.Merchant) {
        result = await this.generateKhqrForMerchant(data as MerchantDto);
      } else {
        throw new BadRequestException(`Invalid KHQR type: ${type}`);
      }

      const qrImage = await this.generateQrImage(result.qr);

      return {
        qrCodeImage: qrImage,
        md5: result.md5,
      };
    } catch (error) {
      this.logger.error('Failed to generate KHQR', {
        error: error.message,
        type,
        data
      });
      throw error;
    }
  }

//TODO Check Transaction
  async checkTransaction(md5: string, bakongToken: string): Promise<any> {
    this.logger.debug(`Checking transaction for MD5: ${md5}`);

    try {
      if (!md5 || !bakongToken) {
        throw new BadRequestException('MD5 and Bakong token are required');
      }

      const response = await checkTransactionByMd5(md5, bakongToken);
      this.logger.log('Transaction check completed successfully', { md5 });
      return response;
    } catch (error) {
      this.handleError('Failed to check transaction', error);
    }
  }

  //TODO Generate KHQR for Individual
  private async generateKhqrForIndividual(
    param: IndividualDto,
  ): Promise<GenerateResult> {
    this.logger.debug('Generating Individual KHQR', {
      accountId: param.bakongAccountID,
    });

    try {
      const individualInfo = new IndividualInfo(
        param.bakongAccountID,
        param.accName,
		param.currency,
		param.amount,
        this.createOptionalData(param),
      );

      const generated = this.khqr.generateIndividual(individualInfo).data;
	  Logger.log(generated);
      return this.createGenerateResult(generated);
    } catch (error) {
      this.handleError('Failed to generate Individual KHQR', error);
    }
  }

  //TODO Generate KHQR for Merchant
  private async generateKhqrForMerchant(
    param: MerchantDto,
  ): Promise<GenerateResult> {
    this.logger.debug('Generating Merchant KHQR', {
      merchantId: param.merchantID,
    });

    try {

      const merchantInfo = new MerchantInfo(
        param.bakongAccountID,
        this.createOptionalData(param),
      );

      const generated = this.khqr.generateMerchant(merchantInfo).data;
      return this.createGenerateResult(generated);
    } catch (error) {
      this.handleError('Failed to generate Merchant KHQR', error);
    }
  }

  private async generateQrImage(qrData: string): Promise<string> {
    try {
      return await QRCode.toDataURL(qrData, {
        type: 'png',
        errorCorrectionLevel: 'H',
        margin: 1,
      });
    } catch (error) {
      this.handleError('Failed to generate QR image', error);
    }
  }

  private createOptionalData(param: IndividualDto | MerchantDto): BaseOptionalData {
	const optionalData: BaseOptionalData = {
	  currency: param.currency,
	  amount: param.amount,
	};

	// Remove undefined properties
	Object.keys(optionalData).forEach(key => {
	  if (optionalData[key as keyof BaseOptionalData] === undefined) {
		delete optionalData[key as keyof BaseOptionalData];
	  }
	});

	return optionalData;
  }

  private createGenerateResult(generated: {
    qr: string;
    md5: string;
  }): GenerateResult {
    return {
      qr: generated.qr,
      md5: generated.md5,
    };
  }

  private handleError(message: string, error: any): never {
    this.logger.error(message, error?.stack);

    if (error instanceof BadRequestException) {
      throw error;
    }

    throw new InternalServerErrorException(
      `${message}: ${error?.message || 'Unknown error'}`,
    );
  }
}
