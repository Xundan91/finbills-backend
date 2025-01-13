import { z } from "zod";
import prisma from "../prisma";
import { Request, Response } from "express";

const businessSchema = z.object({
	name: z.string(),
	address: z.string(),
	email: z.string().email(),
	phone: z.string().length(10),
});

export const addBusiness = async (req: Request, res: Response) => {
	const {
		name,
		phone,
		email,
		address,
	}: { name: string; phone: string; email: string; address: string } = req.body;

	try {
		const validateBuisnessSch = businessSchema.safeParse(req.body);
		if (validateBuisnessSch.success) {
			const buisnessExist = await prisma.business.findUnique({
				where: {
					email,
				},
			});
			if (buisnessExist) {
				res.json({ msg: `Business already cerated` });
			} else {
				const buisness = await prisma.business.create({
					data: validateBuisnessSch.data,
				});
				if (buisness) {
					res.json({ msg: "SUCCESS", buisness });
				} else {
					res.status(411).json({ msg: "business not created" });
				}
			}
		} else {
			res.status(411).json({
				msg: "Validation failed",
			});
		}
	} catch (e) {
		console.log("Error: " + e);
		res.status(500).json({
			msg: "Failed",
		});
	}
};
