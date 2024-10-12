import axios from 'axios';

interface SourceInfo {
  appIconUrl: string;
  appName: string;
  appDeepLinkCallback: string;
}

interface RequestBody {
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

async function generateDeeplink(body: RequestBody): Promise<string> {
  try {
    const response = await axios.post<ApiResponse>(
      'https://api-bakong.nbc.gov.kh/v1/generate_deeplink_by_qr',
      body
    );

    if (response.data.responseCode === 0) {
      return response.data.data.shortLink;
    } else {
      throw new Error(response.data.responseMessage);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`API request failed: ${error.message}`);
    } else {
      throw error;
    }
  }
}

export { generateDeeplink };