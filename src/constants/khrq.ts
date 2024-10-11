export enum KhqrType {
	Individual = "personal",
	Merchant = "merchant",
}

export enum Api {
	URL = "https://api-bakong.nbc.gov.kh/v1",
}

export enum Currency {
	KHR = "KHR",
	USD = "USD",
}

export enum TransactionStatus {
	PAID = 'ទឹកប្រាក់ត្រូវបានបង់',
	UNPAID = 'ទឹកប្រាក់មិនត្រូវបានបង់',
	PENDING = 'កំពុងដំណើរការ',
	ERROR = 'មានបញ្ហា',
  }
