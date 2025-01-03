import express from "express";
import businessRoutes from "../routes/business";
import productRoutes from "../routes/product";

const router = express.Router();

router.use("/buisness", businessRoutes);
router.use("/products", productRoutes);

export default router;
