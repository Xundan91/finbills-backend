import prisma from "../prisma";
import { Response, Request } from "express";
import z, { custom } from "zod";
import {
	InvoiceData,
	InvoiceItem,
	ledgerItemInfoSchema,
	customerSchema,
} from "../Schema";

import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";

interface fullCustomerDetailSchema extends customerSchema {
	businessId: number;
}

const customerZodSchema = z.object({
	name: z.string(),
	email: z.string(),
	phone: z.string().max(12),
	address: z.string().nullable().optional().default(null),
});

export const genInvoice = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { from, to, logo, number, date, due_date, items, notes, terms } =
			req.body as InvoiceData;

		// Validate required fields
		if (!number || !items?.length) {
			res.status(400).json({ error: "Invalid invoice data" });
			return;
		}

		// Ensure download directory exists
		const downloadDir = path.join(__dirname, "../public/downloads");
		if (!fs.existsSync(downloadDir)) {
			fs.mkdirSync(downloadDir, { recursive: true });
		}

		// Generate Invoice HTML
		const invoiceHtml = `
            <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        h1 { color: #333; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        table, th, td { border: 1px solid #ddd; }
                        th, td { padding: 10px; text-align: left; }
                        img { max-width: 150px; margin-bottom: 20px; }
                    </style>
                </head>
                <body>
                    <h1>Invoice #${number}</h1>
                    <p>Date: ${date}</p>
                    <p>Due Date: ${due_date}</p>
                    <p><strong>From:</strong> ${from}</p>
                    <p><strong>To:</strong> ${to}</p>
                    <img src="${logo}" alt="Logo" />
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Unit Cost</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${items
															.map(
																(item) => `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>${item.quantity}</td>
                                    <td>${item.unit_cost}</td>
                                    <td>${item.quantity * item.unit_cost}</td>
                                </tr>
                            `
															)
															.join("")}
                        </tbody>
                    </table>
                    <p>${notes}</p>
                    <p>${terms}</p>
                </body>
            </html>
        `;

		// Launch browser and create page
		const browser = await puppeteer.launch();
		const page = await browser.newPage();

		try {
			// Generate PNG
			await page.setContent(invoiceHtml, { waitUntil: "networkidle0" });
			const pngPath = path.join(downloadDir, `invoice-${number}.png`);
			await page.screenshot({ path: pngPath, fullPage: true });

			// Generate PDF from PNG
			const pngBytes = fs.readFileSync(pngPath);
			const pdfDoc = await PDFDocument.create();
			const pngImage = await pdfDoc.embedPng(pngBytes);

			const pdfPage = pdfDoc.addPage([pngImage.width, pngImage.height]);
			pdfPage.drawImage(pngImage, {
				x: 0,
				y: 0,
				width: pngImage.width,
				height: pngImage.height,
			});

			const pdfBytes = await pdfDoc.save();
			const pdfPath = path.join(downloadDir, `invoice-${number}.pdf`);
			fs.writeFileSync(pdfPath, pdfBytes);

			// Send response with file URLs
			res.status(200).json({
				pngUrl: `/downloads/invoice-${number}.png`,
				pdfUrl: `/downloads/invoice-${number}.pdf`,
			});
		} finally {
			await browser.close();
		}
	} catch (error) {
		console.error("Error generating invoice:", error);
		res.status(500).json({
			error: "Failed to generate invoice",
			details: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

export const sellItem = async (req: Request, res: Response): Promise<any> => {
	const businessId = Number(req.headers.businessid);
	const productsInfo: Array<ledgerItemInfoSchema> = req.body;

	if (productsInfo) {
		try {
			const customerId = Number(req.params["customerId"]);
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
					throw new Error(`Error: ${err}`);
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

export const addCustomer = async (
	req: Request,
	res: Response
): Promise<any> => {
	try {
		const customerDetails: customerSchema = req.body;
		const businessId = Number(req.headers.businessid);
		const validateCustomer = customerZodSchema.safeParse(customerDetails);

		if (validateCustomer.success) {
			const fullCustomerDetail = {
				businessId,
				...validateCustomer.data,
			};
			const allCustomer = await prisma.customer.findMany({
				where: {
					businessId,
				},
			});

			if (allCustomer.length == 0) {
				const customer = await prisma.customer.create({
					data: fullCustomerDetail,
				});

				if (customer) {
					res.json({
						msg: "Success! Customer created",
						customer,
					});
				} else {
					res.status(411).json({
						msg: "Failed",
					});
				}
			} else {
				const customerExist = allCustomer.some(
					(customer) => customer.email === validateCustomer.data.email
				);

				if (customerExist) {
					return res.status(409).json({
						msg: "Customer in business already exists",
					});
				}

				const customer = await prisma.customer.create({
					data: fullCustomerDetail,
				});

				if (customer) {
					res.json({
						msg: "Success",
						customer,
					});
				} else {
					res.status(411).json({
						msg: "Failed! Customer in the business not created",
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
	const customerId = Number(req.params["customerId"]);
	if (customerId) {
		const customer = await prisma.customer.findUnique({
			where: {
				id: customerId,
			},
		});
		if (customer) {
			res.json({
				msg: "Success! Customer Found",
				customer,
			});
		} else {
			res.json({
				msg: "Customer not found",
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
