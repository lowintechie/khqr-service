export interface KhqrResponse {
	success: boolean;
	data: {
	  qrCodeImage: string;
	  md5: string;
	};
	message: string;
  }
