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
