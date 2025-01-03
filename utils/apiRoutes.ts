import express from "express";
<<<<<<< HEAD
import businessRoutes from "../routes/business";
=======
import businessRoutes from "../routes/buisness";
<<<<<<< HEAD
>>>>>>> 560d77e94b706fab8706a74e8b7ab108c19798ea
=======
>>>>>>> 560d77e94b706fab8706a74e8b7ab108c19798ea
import productRoutes from "../routes/product";

const router = express.Router();

router.use("/buisness", businessRoutes);
router.use("/products", productRoutes);

export default router;
