import express from "express";
import { addProducts } from "../controllers/inventoryController";
const router = express.Router();

router.post('/addItems/:businessId' , addProducts);

export default router;
