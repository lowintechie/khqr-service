interface SourceInfo {
    appIconUrl: string;
    appName: string;
    appDeepLinkCallback: string;
  }
  
  interface GenerateDeeplinkDto {
    qr: string;
    sourceInfo: SourceInfo;
  }
  
  interface ApiResponse {
    responseCode: number;
    responseMessage: string;
    errorCode: null | string;
    data: {
      shortLink: string;
    };
  }