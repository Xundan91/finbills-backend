import { Router, Request, Response } from "express";
import { z } from "zod";
import prisma from "../prisma";

const addbuisness = Router();

const buisnessSchema = z.object({
	name: z.string(),
	address: z.string(),
	email: z.string().email(),
	phone: z.string().length(10),
});

addbuisness.get("/", (req, res) => {
	res.json("hi");
});

addbuisness.post("/", async (req: Request, res: Response) => {
	const {
		name,
		phone,
		email,
		address,
	}: { name: string; phone: string; email: string; address: string } = req.body;

	try {
		const validateBuisnessSch = buisnessSchema.safeParse(req.body);
		if (validateBuisnessSch.success) {
			const buisness = await prisma.business.create({
				data: validateBuisnessSch.data,
			});
			if (buisness) {
				res.json({ msg: "SUCCESS", buisness });
			} else {
				res.status(411).json({ msg: "Fuck you again" });
			}
		} else {
			res.status(411).json({
				msg: "Fck you",
			});
		}
	} catch (e) {
		console.log("Error: " + e);
		res.status(500).json({
			msg: "Failed",
		});
	}
});

export default addbuisness;
