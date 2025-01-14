export interface productSchema {
	itemName: string;
	description: string;
	p_price: number;
	s_price: number;
	stock_number: number;
	mrp: number;
	gst_rate: number;
	barcode: string;
	img_url: string;
}

export interface categorySchema {
	name: string;
	hsn: string;
}

export interface InvoiceItem {
	name: string;
	quantity: number;
	unit_cost: number;
}

export interface InvoiceData {
	from: string;
	to: string;
	logo: string;
	number: string;
	date: string;
	due_date: string;
	items: InvoiceItem[];
	notes: string;
	terms: string;
}

export interface ledgerItemInfoSchema {
	price: number;
	quantity: number;
	productId: number;
}

export interface customerSchema {
	name: string;
	email: string;
	phone: string;
	address?: string | null;
}
