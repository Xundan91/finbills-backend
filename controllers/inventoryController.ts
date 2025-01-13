import { z } from "zod";
import { Response, Request } from "express";
import prisma from "../prisma";
import { productSchema, categorySchema } from "../Schema";

const zodCategorySchema = z.object({
	name: z.string(),
	hsn: z.string(),
});

const zodProductSchema = z.object({
	itemName: z.string(),
	description: z.string(),
	p_price: z.number(),
	s_price: z.number(),
	stock_number: z.number(),
	mrp: z.number(),
	gst_rate: z.number(),
	barcode: z.string(),
	img_url: z.string(),
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

export const addProducts = async (
	req: Request,
	res: Response
): Promise<any> => {
	const productDetails: productSchema = req.body;
	const businessId = Number(req.headers.businessid);
	const categoryId = Number(req.params["categoryId"]);
	const validateProduct = zodProductSchema.safeParse(productDetails);

	if (validateProduct.success) {
		const fullProductDetail = {
			businessId,
			categoryId,
			...validateProduct.data,
		};
		try {
			const allProduct = await prisma.product.findMany({
				where: {
					businessId,
					categoryId,
				},
			});
			if (allProduct.length === 0) {
				const product = await prisma.product.create({
					data: fullProductDetail,
				});
				if (product) {
					res.json({
						msg: "Succcess",
					});
				} else {
					res.status(500).json({
						msg: "Failed",
					});
				}
			} else {
				const productExist = allProduct.some(
					(product) => product.itemName === validateProduct.data.itemName
				);
				if (productExist) {
					return res.status(400).json({
						msg: `Product already exists`,
					});
				}
				const product = await prisma.product.create({
					data: fullProductDetail,
				});
				if (product) {
					res.json({ msg: "Success" });
				} else {
					res.status(411).json({
						msg: "Failed",
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
	const businessId = Number(req.headers.businessid);
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
	const businessId = Number(req.headers.businessid);
	const productDetail: productSchema = req.body;
	const validateProductDetail = zodProductSchema.safeParse(productDetail);
	if (validateProductDetail.success) {
		const productId = Number(req.params["productId"]);
		try {
			const product = await prisma.product.findUnique({
				where: {
					businessId,
					id: productId,
				},
			});
			if (product) {
				const updatedProduct = await prisma.product.update({
					where: {
						businessId,
						id: productId,
					},
					data: productDetail,
				});
				if (updatedProduct) {
					res.json({
						msg: "Sucess! Updated Product data",
						updatedProduct,
					});
				}
			} else {
				res.status(411).json({
					msg: "Failed",
				});
			}
		} catch (err) {
			console.log("Error " + err);
			res.status(500).json({
				msg: `Error: ${err}`,
			});
		}
	} else {
		res.status(500).json({
			msg: "Failed",
		});
	}
};

export const feedThroughInvoice = async (req: Request, res: Response) => {};
