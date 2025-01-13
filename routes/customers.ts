import Router from "express";
import * as customerEndpoint from "../controllers/invoiceController";

const router = Router();

router.put("/addCustomer", customerEndpoint.addCustomer);
router.get("/getCustomer", customerEndpoint.getCustomer);
router.get("/allCustomer", customerEndpoint.getAllCustomer);
