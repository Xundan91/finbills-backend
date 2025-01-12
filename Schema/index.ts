export interface productSchema {
	id?: number;
	itemName: string;
	description: string;
	p_price: number;
	s_price: number;
	stock_number: number;
	mrp: number;
	barcode: string;
	opening_stock: number;
	img: string;
}

export interface categorySchema {
	name: string;
	hsn: string;
}
