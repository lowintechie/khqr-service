
// Generate KHQR for Individual
export interface Individual {
  bakongAccountID: string;
  accInfo: string;
  acquiringBank: string;
  currency: string;
  amount: number;
  merchantName: string;
  merchantCity: string;
  billNumber: string;
  mobileNumber: string;
  storeLabel: string;
  terminalLabel: string;
  purposeOfTransaction: string;
  upiAccountInfo: string;
  merchantAlternateLangUsagePreference: string;
  merchantNameAlternateLanguage: string;
  merchantCityAlternateLanguage: string;
}

// Generate KHQR for Merchant
export interface Merchant {
  bakongAccountID: string;
  merchantID: string;
  acquiringBank: string;
  currency: string;
  amount: number;
  merchantName: string;
  merchantCity: string;
  billNumber: string;
  mobileNumber: string;
  storeLabel: string;
  terminalLabel: string;
  purposeOfTransaction: string;
  upiAccountInfo: string;
  merchantAlternateLangUsagePreference: string;
  merchantNameAlternateLanguage: string;
}

export interface BaseOptionalData {
  currency?: string;
  amount?: number;
  mobileNumber?: string;
  storeLabel?: string;
  terminalLabel?: string;
  purposeOfTransaction?: string;
  languagePreference?: string;
  merchantNameAlternateLanguage?: string;
  merchantCityAlternateLanguage?: string;
  upiMerchantAccount?: string;
}
