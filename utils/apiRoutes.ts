import express from "express";
import businessRoutes from "../routes/buisness";
import productRoutes from "../routes/Products";

const router = express.Router();

router.use("/business", businessRoutes);
router.use("/products", productRoutes);

export default router;
