import Router from "express";
import * as customerEndpoint from "../controllers/invoiceController";

const router = Router();

router.post("/addCustomer", customerEndpoint.addCustomer);
router.get("/getCustomer/:customerId", customerEndpoint.getCustomer);
router.get("/allCustomer", customerEndpoint.getAllCustomer);

router.post("/generate-invoice", customerEndpoint.genInvoice);
export default router;
