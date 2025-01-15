import Router from "express";
import * as ledgerEnpoints from "../controllers/ledgerController";

const router = Router();

router.get("/customerLedger/:customerId", ledgerEnpoints.ledgerofCustomer);
router.get("/businessLedger", ledgerEnpoints.ledgerOfBusiness);

export default router;
