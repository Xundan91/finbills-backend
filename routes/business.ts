import express from "express";
import { addBusiness } from "../controllers/businessControllers";

const router = express.Router();

router.post("/addbusiness", addBusiness);

export default router;
