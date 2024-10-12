import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { BakongKHQR, IndividualInfo, MerchantInfo, khqrData } from 'bakong-khqr';
import * as QRCode from 'qrcode';
import { IndividualDto } from 'src/dto/individual';
import { MerchantDto } from 'src/dto/merchant';
import { BaseOptionalData } from 'src/interface/bakong-properties';

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

      if (type === 'personal') {
        result = await this.generateKhqrForIndividual(data as IndividualDto);
        Logger.log("hello " + result.qr);
      } else if (type === 'merchant') {
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

  //TODO Generate KHQR for Individual
  private async generateKhqrForIndividual(
    param: IndividualDto,
  ): Promise<GenerateResult> {
    this.logger.debug('Generating Individual KHQR', {
      bakongAccountID: param.bakongAccountID,
    });

    try {
      const individualInfo = new IndividualInfo(
        param.bakongAccountID,
        param.accName,
        param.address,
        this.createOptionalData(param),
      );
      const generated = this.khqr.generateIndividual(individualInfo).data;
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
      currency: param.currency === 'USD' ? khqrData.currency.usd : '',
      amount: param.amount,
      mobileNumber: '',
      storeLabel: '',
      accountInformation: param.accountInformation,
      terminalLabel: '',
      purposeOfTransaction: '',
      languagePreference: '',
      merchantNameAlternateLanguage: '',
      merchantCityAlternateLanguage: '',
      upiMerchantAccount: '',
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
