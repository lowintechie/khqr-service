class KhqrData {
  qrCodeImage: string;
  md5: string;
}

export class KhqrResponse {
  success: boolean;
  data: KhqrData;
  message: string;
}
