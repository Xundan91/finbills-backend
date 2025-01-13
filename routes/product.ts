import express from "express";
import * as productEndPoints from "../controllers/inventoryController";
import { sellItem } from "../controllers/invoiceController";
const router = express.Router();

router.post("/addCategory", productEndPoints.addCategory);
router.get("/getCategory", productEndPoints.fetchCategory);
router.post("/addProduct/:categoryId", productEndPoints.addProducts);
router.get("/getProducts", productEndPoints.getProducts);
// router.put("/updateProduct", productEndPoints.updateProductDetail);

router.post("/sellItem", sellItem);
export default router;
