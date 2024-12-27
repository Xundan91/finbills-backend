import express from "express";
import addbuisness from "../seed/buisnessSeed";

const router = express.Router();

router.use("/addbuisness", addbuisness);

router.get("/", (req, res) => {
	res.send("Business API");
});

export default router;
