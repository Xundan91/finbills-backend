import express from "express";
import businessRoutes from "../routes/business";
import productRoutes from "../routes/product";
import customerRouter from "../routes/customers";

const router = express.Router();

router.use("/business", businessRoutes);
router.use("/products", productRoutes);
router.use("/customer", customerRouter);

export default router;
