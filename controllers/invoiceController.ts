import prisma from "../prisma";
import { Response, Request } from "express";
import z, { custom } from "zod";

interface customerSchema {
	name: string;
	email: string;
	phone: string;
	address?: string | null;
}

interface fullCustomerDetailSchema extends customerSchema {
	businessId: number;
}

interface ledgerItemInfoSchema {
	price: number;
	quantity: number;
	productId: number;
}

const customerZodSchema = z.object({
	name: z.string(),
	email: z.string(),
	phone: z.string().max(12),
	address: z.string().nullable().optional().default(null),
});

export const genInvoice = async (req: Request, res: Response) => {
	try {
		const buisnessId = req.params;
		const {} = req.body;
	} catch (err) {}
};

export const sellItem = async (req: Request, res: Response) => {
	const businessId = Number(req.headers.businessId);
	const productsInfo: Array<ledgerItemInfoSchema> = req.body;

	if (productsInfo) {
		try {
			const customerId = Number(req.params.customerId);
			let totalAmount = productsInfo.reduce(
				(sum: number, product: ledgerItemInfoSchema) => sum + product.price,
				0
			);

			const ledger = await prisma.ledger.create({
				data: {
					customerId,
					totalAmount,
					businessId,
				},
			});
			if (ledger) {
				try {
					await Promise.all(
						productsInfo.map(async (product: ledgerItemInfoSchema) => {
							const legderItem = await prisma.ledgerItem.create({
								data: {
									ledgerId: ledger.id,
									quantity: product.quantity,
									price: product.price,
									productId: product.productId,
								},
							});

							await prisma.product.update({
								where: { id: product.productId },
								data: {
									stock_number: {
										decrement: product.quantity,
									},
								},
							});
						})
					);
				} catch (err) {
					throw new Error(`Nhi hua Process Ma chud gyi iski`);
				}
			} else {
				res.status(411).json({
					msg: "Failed! Ledger not created",
				});
			}
		} catch (err) {
			console.log(`Error: ${err}`);
			res.status(500).json({
				msg: "Failed",
			});
		}
	}
	// if (productIds) {
	// 	try {
	// 		const customerId = Number(req.params.customerId);
	// 		if (customerId) {
	// 			const productPromise = productIds.map(async (p_id: number) => {
	// 				const product = await prisma.product.findUnique({
	// 					where: {
	// 						id: p_id,
	// 					},
	// 				});
	// 				if (product) {
	// 					return product.s_price;
	// 				} else {
	// 					throw new Error(`Product with id ${p_id} not found`);
	// 				}
	// 			});
	// 			const productPrices = await Promise.all(productPromise);
	// 			const totalAmount = productPrices.reduce(
	// 				(sum, price) => sum + price,
	// 				0
	// 			);
	// 			if (totalAmount) {
	// 				const ledger = await prisma.ledger.create({
	// 					data: {
	// 						customerId,
	// 						totalAmount,
	// 						businessId,
	// 					},
	// 				});
	// 				if (ledger) {
	//           productIds.map( async (p_id: number) => {
	//             const product = await prisma.product.findUnique({
	//               where: {
	//                 id: p_id
	//               }
	//             })
	//             if(product) {

	//             }
	//           })
	// 				} else {
	// 					res.status(411).json({
	// 						msg: "Ledger not created",
	// 					});
	// 				}
	// 			} else {
	// 				res.status(411).json({
	// 					msg: "Something gone wrong",
	// 				});
	// 			}
	// 		} else {
	// 			res.status(411).json({
	// 				msg: "Customer not Found",
	// 			});
	// 		}
	// 	} catch (err) {
	// 		res.status(500).json({
	// 			msg: "Failed",
	// 		});
	// 	}
	// } else {
	// 	res.status(500).json({
	// 		msg: "Failed",
	// 	});
	// }
};

export const addCustomer = async (req: Request, res: Response) => {
	try {
		const customerDetails: customerSchema = req.body;
		const businessId = Number(req.headers.businessId);
		const validateCustomer = customerZodSchema.safeParse(customerDetails);

		if (validateCustomer.success) {
			const exists = await prisma.customer.findUnique({
				where: {
					email: validateCustomer.data.email,
				},
			});

			if (exists) {
				res.json({
					msg: "Customer already present",
					customer: exists,
				});
			} else {
				const customerFullDetail = {
					...validateCustomer.data,
					businessId,
				};

				const newCustomer = await prisma.customer.create({
					data: customerFullDetail,
				});
				if (newCustomer) {
					res.json({
						msg: "Sucess",
						customer: newCustomer,
					});
				} else {
					res.status(411).json({
						msg: "Customer not added",
					});
				}
			}
		} else {
			res.status(411).json({
				msg: "Customer Schema Problem",
			});
		}
	} catch (err) {
		console.log(`Error: ${err}`);
		res.status(500).json({
			msg: "Failed",
		});
	}
};

export const getCustomer = async (req: Request, res: Response) => {
	const customerDetails: fullCustomerDetailSchema = req.body;
	if (customerDetails) {
		const customer = await prisma.customer.findUnique({
			where: {
				email: customerDetails.email,
			},
		});
		if (customer) {
			res.json({
				msg: "Success",
				customer,
			});
		} else {
			res.status(411).json({
				msg: "Failed",
			});
		}
	} else {
		res.status(411).json({
			msg: "Customer Detail not found",
		});
	}
	try {
	} catch (err) {
		console.log(`Error ${err}`);
		res.status(500).json({
			msg: "Failed",
		});
	}
};

export const getAllCustomer = async (req: Request, res: Response) => {
	try {
		const allCustomer: Array<fullCustomerDetailSchema> =
			await prisma.customer.findMany();
		if (allCustomer) {
			res.json({
				msg: "Success",
				customers: allCustomer,
			});
		} else {
			res.json(500).json({
				msg: "Failed",
			});
		}
	} catch (err) {
		console.log(`Error: ${err}`);
		res.status(411).json({
			msg: "Failed",
		});
	}
};
