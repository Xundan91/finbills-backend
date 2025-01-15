import { Response, Request } from "express";
import prisma from "../prisma";

export const ledgerofCustomer = async (
	req: Request,
	res: Response
): Promise<any> => {
	const businessId = Number(req.headers.businessid);
	const customerId = Number(req.params["customerId"]);
	try {
		const ledger = await prisma.ledger.findMany({
			where: {
				businessId,
			},
			include: {
				ledgerItems: true,
			},
		});
		if (ledger) {
			const customerLedger = ledger.find(
				(ledger) => ledger.customerId === customerId
			);
			if (customerLedger) {
				res.json({
					msg: "Success",
					customerLedger,
				});
			} else {
				res.status(400).json({
					msg: "Failed! Customer's ledger couldn't found",
				});
			}
		} else {
			res.status(411).json({
				msg: "Failed",
			});
		}
	} catch (err) {
		console.log(`Error ${err}`);
		res.status(500).json({
			msg: "Failed",
		});
	}
};

export const ledgerOfBusiness = async (req: Request, res: Response) => {
	const businessId = Number(req.headers.businessid);
	try {
		const ledger = await prisma.ledger.findMany({
			where: {
				businessId,
			},
			include: {
				ledgerItems: true,
			},
		});
		if (ledger) {
			res.json({
				msg: "Success",
				ledger,
			});
		} else {
			res.status(400).json({
				msg: `Failed! couldn't find ledger`,
			});
		}
	} catch (err) {
		console.log(`Err ${err}`);
		res.status(411).json({
			msg: `Failed: ${err}`,
		});
	}
};
