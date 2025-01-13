import { z } from "zod";
import { Response, Request } from "express";
import prisma from "../prisma";
import { productSchema, categorySchema } from "../Schema";
import { empty } from "@prisma/client/runtime/library";

const zodCategorySchema = z.object({
	name: z.string(),
	hsn: z.string(),
});

const zodProductSchema = z.object({
	id: z.number().optional(),
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

export const addCategory = async (
	req: Request,
	res: Response
): Promise<any> => {
	console.log(req.headers);
	const businessId = Number(req.headers.businessid);
	console.log(businessId + " " + typeof businessId);
	const categoryDetails: categorySchema = req.body;
	const validateCategory = zodCategorySchema.safeParse(categoryDetails);

	if (validateCategory.success) {
		const fullCategory = {
			businessId,
			...validateCategory.data,
		};
		try {
			const existingCategories = await prisma.category.findMany({
				where: {
					businessId,
				},
			});
			console.log(existingCategories);
			if (existingCategories.length === 0) {
				const category = await prisma.category.create({
					data: fullCategory,
				});
				if (category) {
					res.json({
						msg: "Sucess",
						category,
					});
				} else {
					res.status(411).json({
						msg: "Something went wrong",
					});
				}
			} else {
				const hsnExists = existingCategories.some(
					(category) => category.hsn === validateCategory.data.hsn
				);

				if (hsnExists) {
					return res
						.status(409)
						.json({ msg: "Category with this HSN already exists" });
				}

				const category = await prisma.category.create({
					data: fullCategory,
				});

				if (category) {
					res.json({
						msg: "Success",
						category,
					});
				} else {
					res.status(411).json({
						msg: "Something went Wrong",
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
	const businessId = Number(req.headers.businessid);
	try {
		const categories = await prisma.category.findMany({
			where: {
				businessId,
			},
		});
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
	const businessId = Number(req.headers.businessId);
	const categoryId = Number(req.params["categoryId"]);
	const validateProduct = zodProductSchema.safeParse(productDetails);

	if (validateProduct.success) {
		try {
			const allProduct = await prisma.product.findMany({
				where: {
					businessId,
				},
			});
			let itemExist: boolean = false;
			allProduct.forEach(async (product) => {
				if (product.itemName == validateProduct.data.itemName) {
					itemExist = true;
				}
			});
			if (itemExist) {
				res.json({
					msg: "Item already exist",
				});
			} else {
				const fullProductDetail = {
					businessId,
					categoryId,
					...validateProduct.data,
				};
				const product = await prisma.product.create({
					data: fullProductDetail,
				});
				if (product) {
					res.json({
						msg: "Success",
						product,
					});
				} else {
					res.status(411).json({
						msg: "Failed! product not created",
					});
				}
			}
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

export const getProducts = async (req: Request, res: Response) => {
	const businessId = Number(req.headers.businessId);
	try {
		const allProducts = await prisma.product.findMany({
			where: {
				businessId,
			},
		});
		if (allProducts) {
			res.json({
				msg: "Sucess",
				allProducts,
			});
		} else {
			res.status(411).json({
				msg: "Failed",
			});
		}
	} catch (err) {
		res.status(500).json({
			msg: `Error: ${err}`,
		});
	}
};

export const updateProductDetail = async (req: Request, res: Response) => {
	const businessId = Number(req.headers.businessId);
	const productDetail: productSchema = req.body();
	const productId = productDetail.id;
	try {
		const allProducts = await prisma.product.findMany({
			where: {
				businessId,
			},
		});
		if (allProducts) {
			allProducts.forEach(async (product) => {
				if (product.id == productId) {
					const updateProduct = await prisma.product.update({
						where: {
							id: productId,
						},
						data: productDetail,
					});
					if (updateProduct) {
						res.json({
							msg: "Sucess",
							updateProduct,
						});
					} else {
						res.status(411).json({
							msg: "Failed",
						});
					}
				}
			});
		} else {
			res.status(411).json({
				msg: "Couldn't fetched Products",
			});
		}
	} catch (err) {
		res.status(500).json({
			msg: `Error: ${err}`,
		});
	}
};

export const feedThroughInvoice = async (req: Request, res: Response) => {};
