import { z } from "zod";
import { Response, Request } from "express";
import prisma from "../prisma";
import { productSchema, categorySchema } from "../Schema";

const zodCategorySchema = z.object({
	name: z.string(),
	hsn: z.string(),
});

const zodProductSchema = z.object({
	categoryId: z.number(),
	itemName: z.string().min(1, "Item name is required"),
	description: z.string().min(1, "Description is required"),
	p_price: z.number(),
	s_price: z.number(),
	stock_number: z.number(),
	mrp: z.number(),
	gst_rate: z.number(),
	barcode: z.string().min(1, "Barcode is required"),
	img_url: z.string().url("Invalid image URL"),
});

export const addCategory = async (req: Request, res: Response) => {
	const categoryDetails: categorySchema = req.body();
	const validateCategory = zodCategorySchema.safeParse(categoryDetails);

	if (validateCategory.success) {
		try {
			const existingCategory = await prisma.category.findUnique({
				where: {
					hsn: validateCategory.data.hsn,
				},
			});
			if (existingCategory) {
				res.json({ msg: " Category already Exist", existingCategory });
			} else {
				const category = await prisma.category.create({
					data: validateCategory.data,
				});
				if (category) {
					res.json({ msg: "Category created", category });
				} else {
					res.status(411).json({
						msg: "Failed",
					});
				}
			}
		} catch (err) {
			console.log(`Error: ${err}`);
			res.status(411).json({ msg: "Failed" });
		}
	} else {
		res.status(411).json({ msg: "Validation failed" });
	}
};

export const fetchCategory = async (req: Request, res: Response) => {
	try {
		const categories = await prisma.category.findMany({});
		if (categories) {
			res.json({
				msg: "Success",
				categories,
			});
		} else {
			res.status(411).json({
				msg: "Failed",
			});
		}
	} catch (err) {
		console.log(`Error: ${err}`);
		res.status(500).json({
			msg: "Failed",
		});
	}
};

export const addProducts = async (req: Request, res: Response) => {
	const productDetails: productSchema = req.body();
	const businessId = req.headers.businessId;
	const categoryId = req.params;
	const validateProduct = zodProductSchema.safeParse(productDetails);

	if (validateProduct.success) {
		try {
			const existingProduct = prisma.product.findUnique({
				where: {
					businessId,
					categoryId,
				},
			});
		} catch (err) {
			console.log(`Error: ${err}`);
			res.status(500).json({ msg: "Failed" });
		}
	} else {
		res.status(411).json({
			msg: "Failed! Validation issue",
		});
	}
};
