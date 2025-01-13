export interface productSchema {
	itemName: string;
	description: string;
	p_price: number;
	s_price: number;
	stock_number: number;
	mrp: number;
	gst_rate: number;
	barcode: string;
	opening_stock: number;
	img_url: string;
}

export interface categorySchema {
	name: string;
	hsn: string;
}
