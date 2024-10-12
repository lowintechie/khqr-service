import axios, { AxiosResponse } from 'axios';

interface BakongApiResponse {
    responseCode: number;
    responseMessage: string;
    errorCode: number | null;
    data: {
        hash: string;
        fromAccountId: string;
        toAccountId: string;
        currency: string;
        amount: number;
        description: string;
        createdDateMs: number;
        acknowledgedDateMs: number;
        trackingStatus: string | null;
        receiverBank: string | null;
        receiverBankAccount: string | null;
        instructionRef: string | null;
        externalRef: string;
    } | null;
}

interface SimplifiedResponse {
    date: string;
    status: 'success' | 'fail';
    message: string;
    httpCode: number;
}

async function checkBakongTransaction(bakongToken: string, md5: string): Promise<SimplifiedResponse> {
    const url = 'https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5';

    try {
        const response: AxiosResponse<BakongApiResponse> = await axios.post(
            url,
            { md5 },
            {
                headers: {
                    'Authorization': `Bearer ${bakongToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const currentDate = new Date().toISOString();

        if (response.data.responseCode === 0) {
            return {
                date: currentDate,
                status: 'success',
                message: 'Transaction is successful',
                httpCode: response.status
            };
        } else {
            return {
                date: currentDate,
                status: 'fail',
                message: 'Transaction is not found',
                httpCode: response.status
            };
        }
    } catch (error) {
        const currentDate = new Date().toISOString();
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.response?.data || error.message);
            return {
                date: currentDate,
                status: 'fail',
                message: error.response?.data?.responseMessage || 'An error occurred',
                httpCode: error.response?.status || 500
            };
        } else {
            console.error('Unexpected error:', error);
            return {
                date: currentDate,
                status: 'fail',
                message: 'An unexpected error occurred',
                httpCode: 500
            };
        }
    }
}

export default checkBakongTransaction;